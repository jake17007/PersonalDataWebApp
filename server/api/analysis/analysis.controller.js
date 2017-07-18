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
/*
function getUserData(appAndUserData) {
  return new Promise(function(resolve, reject) {
    // aggregate the functions needed to retrieve the data from their respective providers' apis
    aggregateDataGetters(appAndUserData.app, function(err, dataGetters) {
      if (err) {
        console.log(err);
        reject(err);
      }
      // Get all the data
      Promise.all(dataGetters.map(callback => callback(appAndUserData.userRequiredApiInfo, appAndUserData.user)))
      .then(handleExpiredTokens(appAndUserData))
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
    });

  });
}
*/
// userData = [ {<provider_name>: [<objects>]},
//              {<provider_name>: [<objects>]}, ...]
function runAppForOutput(userData) {
  return new Promise(function(resolve, reject) {
    //console.log('userData: ', userData);
    //var data = userData; // Just get the user object

    /**** CALLING PYTHON ****/
    var options = {mode: 'json'};
    var pyshell = new PythonShell('nodegit/app.py', options);

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

function handleTempFile() {
  return function(result) {

    // Delete the temporary directory for the app if it exists
    if (fs.existsSync('nodegit')) {
      rimraf('nodegit', function() {
        console.log('Temporary git repo deleted.');
      });
    } else {
      console.log('Temporary git repo does not exist');
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
  return Promise.all([
    Analysis.findById(req.params.appId)
    .populate('thirdPartyApiRequirements.thirdPartyApi')
    .populate('thirdPartyApiRequirements.endpoints')
    .exec(),
    User.findById(req.user._id).exec()
  ])
  .then(result => {
    var appAndUserData = {
      app: result[0],
      user: result[1]
    };
    return appAndUserData;
  })
  .then(appAndUserData => {
    return Promise.all([
      buildApp(appAndUserData),
      getThirdPartyData(appAndUserData)
    ]);
  })
  .then(result => {
    //console.log('result[1][0].fitbit: ', result[1][0].fitbit);
    //console.log('result[1][1].moves: ', result[1][1].moves);
    return runAppForOutput(result[1]);
    //return {html: '<div>heres some html from the server</div>'}
  })
  .then(res => {
    //console.log('Heres your current results: ', res);
    return res;
  })
  .then(handleTempFile())
  .then(respondWithResult(res))
  .catch(handleError(res))
  .then(handleTempFile())
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

export function viewJson(req, res) {
  return Promise.all([
    User.findById(req.user._id).exec()
  ])
  .then(user => {
    var appAndUserData = {
      app: req.body,
      user: user[0]
    };
    return appAndUserData;
  })
  .then(appAndUserData => {
    return Promise.all([
      getThirdPartyData(appAndUserData)
    ]);
  })
  .then(result => {
    return result[0];
  })
  .then(respondWithResult(res))
  .catch(handleError(res));
}
/*
export function viewJson(req, res) {
  return User.findById(req.user._id).exec()
  .then(user => {
      return [req.body, user];
  })
  .then(getProviderAccessInfo())
  .then(handleConnectionNotFound(res))
  .then((appAndUserData) => {
    return Promise.all([
      //getUserData(appAndUserData)
    ]);
  })
  .then(result => {
    return result[0];
  })
  .then(respondWithResult(res))
  .catch(handleError(res));
}
*/
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

export function tempTestHtml(req, res) {
  return getHtmlFromFile()
  .then(result => {
    console.log('result from tempTestHtml: ', result);
    return result;
  })
  .then(respondWithResult(res))
  .catch(handleError(res));
}
