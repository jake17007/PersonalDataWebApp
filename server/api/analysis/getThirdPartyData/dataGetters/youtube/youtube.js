'use strict';

import {upsertConnection} from '../../../../../auth/connect/connect.service';
import {handleErrors} from './errorHandlers';
var request = require('request-promise');

function getEndpointDataGetters(connectInfo, endpoints) {
  var dataGetters = [];
  endpoints.forEach(endpointInfo => {

    var endpoint;
    endpointInfo.name === 'channelStatistics' ? endpoint = '/channels' : '';

    dataGetters.push(function(connectInfo, user) {
      return new Promise(function(resolve, reject) {
        // Set the options
        var options = {
          method: 'GET',
          uri: `https://www.googleapis.com/youtube/v3${endpoint}`,
          qs: {
            channelId: connectInfo.userId,
            part: 'statistics',
            mine: true
          },
          auth: {
            bearer: connectInfo.accessToken
          },
          json: true
        }
        // Get the data from the provider
        request(options)
          .then(result => {
            resolve({[endpointInfo.name]: result});
          })
          .catch(err => {
            console.log('youtube api call err: ', err);
            reject(err);
          });
      });
    });
  });
  return dataGetters;
}

export function getYoutubeData(connectInfo, reqrInfo, user, accu) {
  var endpoints = reqrInfo.endpoints;
  var endpointDataGetters = getEndpointDataGetters(connectInfo, endpoints);
  if (accu >= 5) {
    throw('Too many calls');
  } else {
    accu = accu || 0;
    return new Promise(function(resolve, reject) {
      Promise.all(endpointDataGetters.map(endpointDataGetter => endpointDataGetter(connectInfo, user)))
      .then(handleErrors(connectInfo, endpoints, user, reqrInfo, accu))
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

}
