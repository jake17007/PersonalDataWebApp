'use strict';

import {getFitbitData} from './fitbit';
import {upsertConnection} from '../../../../../auth/connect/connect.service';
import User from '../../../../user/user.model';
import {getConnectInfoByProvider} from '../../getThirdPartyData';

var FitbitApiClient = require('fitbit-node'),
  client = new FitbitApiClient(process.env.FITBIT_ID, process.env.FITBIT_SECRET);

function refreshAccessToken(connectInfo, user) {
  console.log('refreshAccessToken was run');
  console.log('connectInfo.accessToken: ', connectInfo.accessToken);
  console.log('connectInfo.refreshToken: ', connectInfo.refreshToken);
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
      console.log('there was an error in refreshing the access token: ', err);
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

function handleExpiredToken(connectInfo, endpoints, user, accu) {
  return refreshAccessToken(connectInfo, user)
  /*
  .then(result => {
    User.findById(user._id).exec()
    .then(user => {
      console.log('user from handleExpiredToken: ', user);
    })
    .catch(err => {
      throw(err);
    });
    return result;
  })
  */
  .then(userUpdated => {
    console.log('userUpdated: ', userUpdated);
    accu++;
    var connectInfoUpdated = getConnectInfoByProvider(userUpdated, 'fitbit');
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

export function handleErrors(connectInfo, endpoints, user, accu) {
  return function(fitbitResponses) {
    console.log('accu: ', accu);
    console.log('fitbitRespones: ', fitbitResponses);
    if (checkForExpiredTokenError(fitbitResponses, accu)) {
      return handleExpiredToken(connectInfo, endpoints, user, accu);
    } else if (checkForOtherErrors(fitbitResponses)) {
      return handleOtherErrors(fitbitResponses);
    } else {
      return fitbitResponses;
    }
  }
}
