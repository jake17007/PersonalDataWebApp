/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/analyses              ->  index
 * POST    /api/analyses              ->  create
 * GET     /api/analyses/:id          ->  show
 * PUT     /api/analyses/:id          ->  upsert
 * PATCH   /api/analyses/:id          ->  patch
 * DELETE  /api/analyses/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Analysis from './analysis.model';
import User from '../user/user.model';
import {aggregateDataGetters, handleExpiredTokenErrorResponses} from './getThirdPartyData/getThirdPartyData';
import {upsertConnection} from '../../auth/connect/connect.service';
import {buildApp} from './buildApp/buildApp';
import {getThirdPartyData} from './getThirdPartyData/getThirdPartyData';
import {getNewNodegitVersion} from './versioning'

var PythonShell = require('python-shell');
var fs = require('fs');
var rimraf = require('rimraf');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }
    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log('BUBBLED ERROR: ', err);
    res.status(statusCode).send(err);
  };
}

function getProviderAccessInfo() {
  return function(appAndUserData) {
    var app = appAndUserData[0];
    var user = appAndUserData[1];
    var requiredApis = app.thirdPartyApiRequirements;

    // Get the connection info (user/connection/connection.model.js) for each required provider
    var userRequiredApiInfo = [];
    var missingConnections = [];
    var providerConnectionInfo;
    requiredApis.forEach(requiredApi => {
      providerConnectionInfo = null;
      providerConnectionInfo = user.connections.find(connection => {
        return connection.provider === requiredApi.provider;
      });
      if (providerConnectionInfo) {
        userRequiredApiInfo.push(providerConnectionInfo);
      } else {
        missingConnections.push(requiredApi);
      }
    });

    // Check for missing connections
    if (missingConnections.length > 0) {
      return {missingConnections: missingConnections};
    } else {
      return {userRequiredApiInfo: userRequiredApiInfo,
              user: user,
              app: app};
    }
  }
}

function handleConnectionNotFound(res) {
  return function(providerAccessInfoResults) {
    if (providerAccessInfoResults.missingConnections) {
      res.status(500).send(providerAccessInfoResults.missingConnections)
      return null;
    }
    return providerAccessInfoResults
  }
}

function handleExpiredTokens(appAndUserData) {
  return function(returnedData) {
    console.log('returnedData here: ', returnedData);
    // Check for errors and update tokens, passes back an array of data getters
    var handleExpired = handleExpiredTokenErrorResponses(returnedData, appAndUserData);
    // Rerun getData (in here on it's own) on the data getters passed back

    handleExpired
    .then(dataGetters => {
      return Promise.all(dataGetters);
    })
    // Rejoin it with the good data and send it
    .then(newResults => {
      var finalResult = [];
      returnedData.forEach(oldResult => {
        newResults.forEach(newResult => {
          if (oldResult.keys()[0] === newResult.keys()[0]) {
            finalResult.push(newResult);
          } else {
            finalResult.push(oldResult);
          }
        });
      });
      console.log('finalResult: ', finalResult);
      resolve(finalResult);
    })
    .catch(err => {
      reject(err);
    });
  }
}

// Passes the data through the app (in nodegit-*) and returns some HTML/CSS/JavaScript
// userData = [ {<provider_name>: [<objects>]},
//              {<provider_name>: [<objects>]}, ...]
function runAppForOutput(nodegitDirName, userData) {
  return new Promise(function(resolve, reject) {
    //console.log('userData: ', userData);
    //var data = userData; // Just get the user object

    /**** CALLING PYTHON ****/
    var options = {mode: 'json'};
    var runFileName = nodegitDirName + '/app.py';
    var pyshell = new PythonShell(runFileName, options);

    pyshell.send(userData);

    var output;
    pyshell.on('message', function(pythonOutput) {
      console.log('Python output received.');
      output = pythonOutput;
    });

    pyshell.end(function(err) {
      if (err) {
        console.log('err: ', err);
        reject(err);
      }
      resolve(output);
    });
  });
}

// Deletes the temporary nodegit-* directory (i.e. the app)
function handleTempFile(nodegitDirName) {
  return function(result) {
    console.log('nodegitDirName: ', nodegitDirName);
    // Delete the temporary directory for the app if it exists
    if (fs.existsSync(nodegitDirName)) {
      rimraf(nodegitDirName, function() {
        console.log('Temporary git repo ' + nodegitDirName + ' deleted.');
      });
    } else {
      console.log('Temporary git repo ' + nodegitDirName + ' does not exist');
    }
    return result;
  }
}

// Gets a list of Analysiss
export function index(req, res) {
  return Analysis.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Get a list of Analyises with thirdPartyApis populated
export function indexForAppStorePage(req, res) {
  return Analysis.find()
  .populate('thirdPartyApiRequirements.thirdPartyApi')
  .exec()
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Gets a single Analysis from the DB
export function show(req, res) {
  return Analysis.findById(req.params.id)
    .populate('thirdPartyApiRequirements.thirdPartyApi')
    .populate('thirdPartyApiRequirements.endpoints')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Analysis in the DB
export function create(req, res) {
  req.body['owner'] = req.user._id;
  return Analysis.create(req.body)
    .then(newApp => {
      return User.findByIdAndUpdate(req.user._id, {$push: {'ownedAppIds': newApp._id}}).exec();
    })
    //.then(seeWhatsHapping())
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// For debugging
function seeWhatsHapping() {
  return function(result) {
    console.log('heres whats happing: ', result);
    return result;
  }
}

// Upserts the given Analysis in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Analysis.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Analysis in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Analysis.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Analysis from the DB
export function destroy(req, res) {
  return Analysis.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Runs an Analysis for a User
 * INPUT:  req - http request
 *         res - http response
 * OUTPUT: Promise
 */
export function runApp(req, res) {
  try {
    // First check to see if nodegit exists, and get the next version number if so
    var nodegitDirName = getNewNodegitVersion();
  } catch(err) {
    console.log(err);
    return(handleError(res));
  }
  // Get the Analysis and the User from the DB
  return Promise.all([
    Analysis.findById(req.params.appId)
    .populate('thirdPartyApiRequirements.thirdPartyApi')
    .populate('thirdPartyApiRequirements.endpoints')
    .exec(),
    User.findById(req.user._id).exec()
  ])
  // Format for easier usability
  .then(result => {
    return {
      app: result[0],
      user: result[1]
    };
  })
  // Retrieve the app from Github and the user's data from third party APIs
  .then(appAndUserData => {
    return Promise.all([
      buildApp(nodegitDirName, appAndUserData),
      getThirdPartyData(appAndUserData)
    ]);
  })
  // Pass the user's data through the app
  .then(result => {
    return runAppForOutput(nodegitDirName, result[1]);
  })
  // Send the response to the client
  .then(respondWithResult(res))
  // OR send an error to the client
  .catch(handleError(res))
  // Delete the temporary directory holding the app
  .then(handleTempFile(nodegitDirName))
  // For debugging
  .catch(err => {
    console.log('An error in deleting the temp file occured: ', err);
  });
}

// Gets a list of all the given user's apps they own
export function getMyOwnedApps(req, res) {
  return Analysis.find({owner: req.user._id}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of all the given user's apps they own
export function getMyFavoriteApps(req, res) {
  return User.findById(req.user._id).exec()
    //.then(seeWhatsHapping())
    .then(user => {
      return Analysis.find({_id: {$in: user.favoriteApps}}).exec()
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Get the user's data per the connection requirements
export function viewJson(req, res) {
  // Get the user from the DB
  return Promise.all([
    User.findById(req.user._id).exec()
  ])
  // Format for easier usability
  .then(user => {
    return {
      app: req.body,
      user: user[0]
    };
  })
  // Get the data
  .then(appAndUserData => {
    return Promise.all([
      getThirdPartyData(appAndUserData)
    ]);
  })
  // Get rid of the array
  .then(result => {
    return result[0];
  })
  // Respond with the result
  .then(respondWithResult(res))
  // Or respond with the error
  .catch(handleError(res));
}

// Helper function: gets the html from the app output
function getHtmlFromFile() {
  return new Promise(function(resolve, reject) {
    fs.readFile('server/api/analysis/view.html', 'utf8', (err, theHtml) => {
      if (err) {
        reject(err);
      }
      resolve(theHtml);
    })
  })
}

// For debugging
export function tempTestHtml(req, res) {
  return getHtmlFromFile()
  .then(result => {
    console.log('result from tempTestHtml: ', result);
    return result;
  })
  .then(respondWithResult(res))
  .catch(handleError(res));
}
