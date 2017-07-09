'use strict';

import {getFitbitData} from './fitbit';
import {upsertConnection} from '../../../../../auth/connect/connect.service';
import User from '../../../../user/user.model';
import {getConnectInfoByThirdPartyApi} from '../../getThirdPartyData';

var FitbitApiClient = require('fitbit-node'),
  client = new FitbitApiClient(process.env.FITBIT_ID, process.env.FITBIT_SECRET);

function refreshAccessToken(connectInfo, user) {
  return new Promise(function(resolve, reject) {
    // Refresh the token
    client.refreshAccessToken(connectInfo.accessToken, connectInfo.refreshToken)
    // Save the new token / refresh token
    .then(tokens => {
      upsertConnection('fitbit', user._id, tokens.access_token, tokens.refresh_token, connectInfo.providerUserId, function(err, userUpdated) {
        if (err) reject(err);
        resolve(userUpdated);
      });
    })
    .catch(err => {
      console.log('There was an error in attemtping to refresh the access token: ', err);
      if (err.context) {
        console.log('err.context: ', err.context);
      }
      reject(err);
    });
  });
}

function checkForExpiredTokenError(fitbitResponses, accu) {
  //if (accu == 0) return true; // For Debugging: Forcing a token refresh
  for (var i = 0; i < fitbitResponses.length; i++) {
    var response = fitbitResponses[i][Object.keys(fitbitResponses[i])[0]];
    for (var j = 0; j < response.length; j++) {
      var element = response[j];
      if (element.errors && element.errors.filter(error => {
        return error.errorType === 'expired_token';
      }).length > 0) {
        console.log('Expired token error found.');
        return true;
      }
    }
  }
  console.log('No expired token error found.');
  return false;
}

function handleExpiredToken(connectInfo, endpoints, user, reqrInfo, accu) {
  return refreshAccessToken(connectInfo, user)
  .then(userUpdated => {
    accu++;
    var connectInfoUpdated = getConnectInfoByThirdPartyApi(userUpdated, reqrInfo.thirdPartyApi._id);
    return getFitbitData(connectInfoUpdated, endpoints, userUpdated, accu);
  })
  .catch(err => {
    throw(err);
  });
}

function checkForOtherErrors(fitbitResponses) {
  for (var i = 0; i < fitbitResponses.length; i++) {
    var response = fitbitResponses[i][Object.keys(fitbitResponses[i])[0]];
    for (var j = 0; j < response.length; j++) {
      var element = response[j];
      if (element.errors) {
        console.log('Other errors found: ', element.errors);
        return true;
      }
    }
  }
  return false;
}

function handleOtherErrors(fitbitResponses) {
  console.log('Other errors were found');
  return fitbitResponses;
}

export function handleErrors(connectInfo, endpoints, user, reqrInfo, accu) {
  return function(fitbitResponses) {
    if (checkForExpiredTokenError(fitbitResponses, accu)) {
      return handleExpiredToken(connectInfo, endpoints, user, reqrInfo, accu);
    } else if (checkForOtherErrors(fitbitResponses)) {
      return handleOtherErrors(fitbitResponses);
    } else {
      return fitbitResponses;
    }
  }
}
