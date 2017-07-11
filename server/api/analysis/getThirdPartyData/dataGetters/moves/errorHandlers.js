'use strict';

import {getMovesData} from './moves';
import {upsertConnection} from '../../../../../auth/connect/connect.service';
import {getConnectInfoByThirdPartyApi} from '../../getThirdPartyData';
var MovesApi = require('moves-api').MovesApi;

function refreshAccessToken(connectInfo, user) {
  console.log('refreshAccessToken was run');
  console.log('connectInfo.accessToken: ', connectInfo.accessToken);
  console.log('connectInfo.refreshToken: ', connectInfo.refreshToken);
  return new Promise(function(resolve, reject) {
    var moves = new MovesApi({
      "clientId": process.env.MOVES_ID,
        "clientSecret": process.env.MOVES_SECRET,
        "redirectUri": 'http://localhost:3000/auth/connect/moves/callback',
        "accessToken": connectInfo.accessToken,
        "refreshToken" : connectInfo.refreshToken
    });
    // Refresh the token
    moves.refreshToken((err, tokens) => {
      if (err) {
        console.log('There was an error in refreshing the access token: ', err);
        if (err.context) {
          console.log('err.context: ', err.context);
        }
        reject(err);
      }
      // Save the new token / refresh token
      upsertConnection('moves', user._id, tokens.access_token, tokens.refresh_token, connectInfo.providerUserId, function(err, user) {
        if (err) reject(err);
        resolve(user);
      });
    });
  });
}

function checkForExpiredTokenError(movesResponses, accu) {
  if (accu == 0) return true; // For Debugging: Forcing a token refresh
  /*
  for (var i = 0; i < movesResponses.length; i++) {
    var response = movesResponses[i][Object.keys(movesResponses[i])[0]];
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
  */
  console.log('No expired token error found.');
  return false;
}

function handleExpiredToken(connectInfo, endpoints, user, reqrInfo, accu) {
  return refreshAccessToken(connectInfo, user)
  .then(userUpdated => {
    connectInfo = getConnectInfoByThirdPartyApi(userUpdated, reqrInfo.thirdPartyApi._id);
    console.log('userUpdated: ', userUpdated);
    accu++;
    return getMovesData(connectInfo, reqrInfo, userUpdated, accu);
  })
  .catch(err => {
    throw(err);
  });
}

function checkForOtherErrors(movesResponses) {
  for (var i = 0; i < movesResponses.length; i++) {
    var response = movesResponses[i][Object.keys(movesResponses[i])[0]];
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

function handleOtherErrors(movesResponses) {
  console.log('Other errors were found');
  return movesResponses;
}

export function handleErrors(err, connectInfo, endpoints, user, accu) {
    if (err === 'expired_access_token') {
      return handleExpiredToken(connectInfo, endpoints, user, accu);
    /*
    } else if (checkForOtherErrors(movesResponses)) {
      return handleOtherErrors(movesResponses);
    */
    } else {
      throw(err);
    }
}
