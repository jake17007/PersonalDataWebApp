'use strict';

import {upsertConnection} from '../../../../../auth/connect/connect.service';
import {handleErrors} from './errorHandlers';
var MovesApi = require('moves-api').MovesApi;

function getEndpointDataGetters(connectInfo, endpoints, accu) {
  var dataGetters = [];
  endpoints.forEach(endpoint => {

    // Get dates
    var date_to = new Date();
    date_to.setDate(date_to.getDate()-1);
    var date_from = new Date();
    date_from.setMonth(date_to.getMonth()-1);

    // Format properly
    date_from = date_from.toISOString().split('T')[0].replace(/-/g, '');
    date_to = date_to.toISOString().split('T')[0].replace(/-/g, '');

    //var date_from = '20170501'; // Temporary, implement current date later
    //var date_to = '20170525'; // Temporary, can implement options someday

    if (endpoint.name === 'profile') {
      dataGetters.push(
        function getMovesData(connectInfo, user) {
          return new Promise(function(resolve, reject) {
            try {
              console.log('getMovesData ran: ', endpoint.name);
              // Create a moves object with the correct access token and refresh token
              var moves = new MovesApi({
                "clientId": process.env.MOVES_ID,
                  "clientSecret": process.env.MOVES_SECRET,
                  "redirectUri": 'http://localhost:3000/auth/connect/moves/callback',
                  "accessToken": connectInfo.accessToken,
                  "refreshToken" : connectInfo.refreshToken
              });


              // Get the data from the provider
              moves.getProfile(function(err, result) {
                if (err) {
                  //console.log('Moves getProfile err: ', err);
                  reject(err);
                }
                //console.log('Moves getProfile result: ', result);
                resolve({[endpoint.name]: result});
              });
            } catch(err) {
              reject(err);
            }
            //resolve('successful return from getMovesData');
          });
        }
      );
    }
    if (endpoint.name === 'storyLine') {
      dataGetters.push(
        function getMovesData(connectInfo, user) {
          return new Promise(function(resolve, reject) {
            try {
              console.log('getMovesData ran: ', endpoint.name);
              // Create a moves object with the correct access token and refresh token
              var moves = new MovesApi({
                "clientId": process.env.MOVES_ID,
                  "clientSecret": process.env.MOVES_SECRET,
                  "redirectUri": 'http://localhost:3000/auth/connect/moves/callback',
                  "accessToken": connectInfo.accessToken,
                  "refreshToken" : connectInfo.refreshToken
              });
              // Get the data from the provider
              moves.getStoryline({ from: `${date_from}`, to: `${date_to}`, trackPoints: false}, function(err, result) {
                if (err) {
                  //console.log('Moves getProfile err: ', err);
                  reject(err);
                }
                //console.log('Moves getProfile result: ', result);
                resolve({[endpoint.name]: result});
              });
            } catch(err) {
              reject(err);
            }
            //resolve('successful return from getMovesData');
          });
        }
      );
    }



  });
  return dataGetters;
}



export function checkForMovesErrors(movesResponses, appAndUserData) {
  movesResponses.forEach(response => {
    if (response.error === 'invalid_grant') {
      return refreshAccessToken(appAndUserData);
    }
  });
}

export function getMovesData(connectInfo, reqrInfo, user, accu) {
  var endpoints = reqrInfo.endpoints;
  var endpointDataGetters = getEndpointDataGetters(connectInfo, endpoints);
  if (accu >= 5) {
    throw('Too many calls');
  } else {
    accu = accu || 0;
    return new Promise(function(resolve, reject) {
      Promise.all(endpointDataGetters.map(endpointDataGetter => endpointDataGetter(connectInfo, user)))
      .catch(err => {
        if (err === 'expired_access_token') {
          return handleErrors(err, connectInfo, endpoints, user, reqrInfo, accu)
        } else {
          reject(err);
        }
      })
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

}
