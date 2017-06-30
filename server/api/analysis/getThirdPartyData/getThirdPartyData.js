'use strict';

import _ from 'lodash';
import {fetchDataGettersByProvider} from './dataGetters/fetchDataGettersByProvider'
import {handleErrors} from './handleErrors/handleErrors'

/**
 * Checks for existence of all required connections for the app within
 * the given User.connections
 *
 * INPUT:  appAndUserData = {
 *            app: Analysis, // the given analysis
 *            user: User     // the given user
 *          }
 * OUTPUT: Promise returning a string 'success' or any errors
 */
function handleMissingConnections(appAndUserData) {
  return new Promise(function(resolve, reject) {
    // Get the required and connected providers
    var requiredProviders = _.map(appAndUserData.app.thirdPartyApiRequirements, 'provider');
    var userConnections = _.map(appAndUserData.user.connections, 'provider');
    // Check for each required provided
    var missingConnections = [];
    requiredProviders.forEach(reqr => {
      var found = userConnections.find(conn => {
        return conn === reqr;
      });
      if (!found) missingConnections.push(reqr);
    });
    // Return the missing connections if there are any
    if (missingConnections.length) reject(Error('Missing Connections: ', missingConnections));
    resolve('success');
  });
}



export function getConnectInfoByProvider(user, providerName) {
  return user.connections.filter(connection => {
    return connection.provider === providerName;
  })[0];
}


/**
 * Aggregates the functions (which return Promises) needed to get
 * the data from each required third party api endpoint
 *
 * INPUT:  appAndUserData = {
 *            app: Analysis, // the given analysis
 *            user: User     // the given user
 *          }
 * OUTPUT: Array of data getters (i.e. functions returning
 *         Promises)
 */
function aggregateDataGetters(appAndUserData) {
  return function() {
    var dataGetters = [];
    var connectInfo;
    appAndUserData.app.thirdPartyApiRequirements.forEach(reqrInfo => {
      // Get just the connection info for this provider
      connectInfo = getConnectInfoByProvider(appAndUserData.user, reqrInfo.provider);
      // Get the dataGetters
      dataGetters = dataGetters.concat(fetchDataGettersByProvider(connectInfo, reqrInfo, appAndUserData.user));
    });
    return dataGetters;
  }
}

/**
 * Aggregates the connection info (access tokens, refresh
 * tokens, etc.) for the third party APIs that are required
 * by the app
 *
 * INPUT:  appAndUserData = {
 *            app: Analysis, // the given analysis
 *            user: User     // the given user
 *          }
 * OUTPUT: An array of Connections (see api/user/connection)
 */
function getRequiredConnectionInfo(appAndUserData) {
  var requiredApis = appAndUserData.app.thirdPartyApiRequirements;
  var user = appAndUserData.user;
  var userRequiredApiInfo = [];
  requiredApis.forEach(requiredApi => {
    userRequiredApiInfo.push(user.connections.find(connection => {
      return connection.provider === requiredApi.provider;
    }));
  });
  return userRequiredApiInfo;
}

/**
 * Runs dataGetters asynchronously
 *
 * INPUT:  appAndUserData = {
 *            app: Analysis, // the given analysis
 *            user: User     // the given user
 *          }
 *         dataGetters - Promises that retreive data from
 *                       third party APIs
 * OUTPUT: Promise returning an array of data or any errors
 */
function runDataGetters(appAndUserData) {
  return function(dataGetters) {
    var userRequiredApiInfo = getRequiredConnectionInfo(appAndUserData);
    console.log(dataGetters);
    return new Promise(function(resolve, reject) {
      return Promise.all(dataGetters)
      .then(returnedData => {
        resolve(returnedData);
      })
      .catch(err => {
        reject(err);
      });
    });
  }
}

function wrapWithProviderLabels(appAndUserData) {
  return function(returnedData) {

    var requiredApis = appAndUserData.app.thirdPartyApiRequirements;
    var labeledData = [];
    for (var i = 0; i < requiredApis.length; i++) {
      labeledData.push({[requiredApis[i].provider]: returnedData[i]});
    }
    return labeledData
    //return returnedData;
  }
}

/**
 * Retrieves the required data required for the app via third
 * party api's
 *
 * INPUT:  appAndUserData = {
 *            app: Analysis, // the given analysis
 *            user: User     // the given user
 *          }
 * OUTPUT: Promise returning an array of data or any errors
 */
export function getThirdPartyData(appAndUserData) {
  return new Promise(function(resolve, reject) {
    handleMissingConnections(appAndUserData)
    .then(aggregateDataGetters(appAndUserData))
    .then(runDataGetters(appAndUserData))
    .then(wrapWithProviderLabels(appAndUserData))
    .then(handleErrors())
    .then(result => {
      resolve(result);
    })
    .catch(err => {
      reject(err);
    });
  });
}
