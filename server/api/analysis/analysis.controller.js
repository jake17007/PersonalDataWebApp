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
import './dataGetters/fitbit';

var Git = require('nodegit');
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
    res.status(statusCode).send(err);
  };
}

// Gets all the access tokens for the providers required for the app
function getProviderAccessTokens() {
  return function(appAndUserData) {
    try {
      var app = appAndUserData[0];
      var user = appAndUserData[1];

      // Get required providers from the app info
      var requiredProviders = app.thirdPartyApiRequirements.filter(provider => {
        return provider.required === true;
      });

      // Get the connection info (user/connection/connection.model.js) for each required provider
      var userRequiredConnectionsInfo = [];
      requiredProviders.forEach(requiredProvider => {
        var connectionInfo = user.connections.find(connection => {
          return connection.provider === requiredProvider.provider;
        });
        userRequiredConnectionsInfo.push(connectionInfo);
      });

      // Return the app info and required connections info
      return {app, userRequiredConnectionsInfo};
    } catch(e) {
      return e;
    }

  }
}

function buildApp(appAndUserData) {
  return new Promise(function(resolve, reject) {
    // Pull the app source code from Github and save it in 'nodegit'
    console.log('From build app: ', appAndUserData.app)
    Git.Clone(appAndUserData.app.githubLink, 'nodegit')
    .then(repository => {
      resolve('build successfull');
    })
    .catch(err => {
      reject(err);
    });
  });

}

function getUserData(appAndUserData) {
  return new Promise(function(resolve, reject) {
    console.log('From get user data: ', appAndUserData.userRequiredConnectionsInfo);

    // Get only required conections info
    var accessInfo = appAndUserData.userRequiredConnectionsInfo.filter(connection => {
      return connection.provider === 'fitbit';
    })

    // Get the fitbit data (this will eventually be separated into serveral calls to all the required providers)
    var FitbitApiClient = require('fitbit-node');
    var client = new FitbitApiClient(process.env.FITBIT_ID, process.env.FITBIT_SECRET);
    client.get("/profile.json", accessInfo[0].accessToken, accessInfo[0].providerUserId)
    .then(results => {
      console.log('results: ', results[0].user.dateOfBirth);
      resolve(results[0].user);
    })
    .catch(err => {
      reject(err);
    });
  });
}

function runTheApp(userData) {
  return new Promise(function(resolve, reject) {
    console.log('this ran');
    console.log('userData: ', userData);
    var data = userData; // Just get the user object

    /**** CALLING PYTHON ****/
    var options = {mode: 'json'};
    var pyshell = new PythonShell('nodegit/pythonTestApp.py', options);

    var output;
    pyshell.send(data);

    pyshell.on('message', function(pythonOutput) {
      console.log('it got a message back');
      output = pythonOutput;
    })
    .end(function(err) {
      if (err) reject(err);
      console.log('output', output);
      resolve(output);
    });
  });
}

function handleTempFile() {
  return function(result) {

    // Delete the temporary directory for the app if it exists
    if (fs.existsSync('nodegit')) {
      rimraf('nodegit', function() {
        console.log('done');
      });
    } else {
      console.log('it does not exist');
    }

    console.log('heres the result', result);
    return result;
  }
}

// Gets a list of Analysiss
export function index(req, res) {
  return Analysis.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Analysis from the DB
export function show(req, res) {
  return Analysis.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Analysis in the DB
export function create(req, res) {
  req.body['ownerId'] = req.user._id;
  return Analysis.create(req.body)
    .then(newApp => {
      console.log('userid: ',req.user._id);
      console.log('hers the new app: ',newApp )
      return User.findByIdAndUpdate(req.user._id, {$push: {'ownedAppIds': newApp._id}}).exec();
    })
    .then(seeWhatsHapping())
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

// Runs an app on a users data, returns the app's output as JSON
export function runApp(req, res) {
  var userId = req.user._id;
  var appId = req.params.appId;
  // Get app info and user info
  return Promise.all([
      Analysis.findById(appId).exec(),
      User.findById(userId).exec()
    ])
    // Get access tokens for providers required by the app
    .then(getProviderAccessTokens())
    // Get the data from the providers and build the app
    .then((appAndUserData) => {
      return Promise.all([
        buildApp(appAndUserData),
        getUserData(appAndUserData)
      ]);
    })
    .then(function(userData) {
      return runTheApp(userData);
    })
    .then(handleTempFile())
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));

}

// Gets a list of all the given user's apps they own
export function getMyOwnedApps(req, res) {
  return Analysis.find({ownerId: req.user._id}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of all the given user's apps they own
export function getMyFavoriteApps(req, res) {
  return User.findById(req.user._id).exec()
    .then(seeWhatsHapping())
    .then(user => {
      return Analysis.find({_id: {$in: user.favoriteApps}}).exec()
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}
