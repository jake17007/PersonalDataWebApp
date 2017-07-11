'use strict';

import {upsertConnection} from '../../../../../auth/connect/connect.service';
import {handleErrors} from './errorHandlers';

var FitbitApiClient = require('fitbit-node'),
  client = new FitbitApiClient(process.env.FITBIT_ID, process.env.FITBIT_SECRET);

function getEndpointDataGetters(connectInfo, endpoints) {
  var dataGetters = [];
  endpoints.forEach(endpointInfo => {

    var date = '2017-02-01'; // Temporary, implement current date later
    var period = '1m'; // Temporary, can implement options someday

    var endpoint;
    endpointInfo.name === 'profile'                                         ? endpoint = '/profile.json' : '/profile.json';
    endpointInfo.name === 'dailyActivitySummary'                            ? endpoint = `/activities/date/${date}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-calories'                     ? endpoint = `/activities/calories/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-caloriesBmr'                  ? endpoint = `/activities/caloriesBMR/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-steps'                        ? endpoint = `/activities/steps/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-distance'                     ? endpoint = `/activities/distance/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-floors'                       ? endpoint = `/activities/floors/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-elevation'                    ? endpoint = `/activities/elevation/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-minutesSedentary'             ? endpoint = `/activities/minutesSedentary/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-minutesLightlyActive'         ? endpoint = `/activities/minutesLightlyActive/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-minutesFairlyActive'          ? endpoint = `/activities/minutesFairlyActive/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-minutesVeryActive'            ? endpoint = `/activities/minutesVeryActive/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-activityCalories'             ? endpoint = `/activities/activityCalories/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-calories'             ? endpoint = `/activities/tracker/calories/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-steps'                ? endpoint = `/activities/tracker/steps/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-distance'             ? endpoint = `/activities/tracker/distance/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-floors'               ? endpoint = `/activities/tracker/floors/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-elevation'            ? endpoint = `/activities/tracker/elevation/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-minutesSedentary'     ? endpoint = `/activities/tracker/minutesSedentary/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-minutesLightlyActive' ? endpoint = `/activities/tracker/minutesLightlyActive/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-minutesFairlyActive'  ? endpoint = `/activities/tracker/minutesFairlyActive/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-minutesVeryActive'    ? endpoint = `/activities/tracker/minutesVeryActive/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'activityTimeSeries-tracker-activityCalories'     ? endpoint = `/activities/tracker/activityCalories/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'bodyTimeSeries-bmi'                              ? endpoint = `/body/bmi/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'bodyTimeSeries-fat'                              ? endpoint = `/body/fat/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'bodyTimeSeries-weight'                           ? endpoint = `/body/weight/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'foodOrWaterTimeSeries-caloresIn'                 ? endpoint = `/foods/log/caloriesIn/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'foodOrWaterTimeSeries-water'                     ? endpoint = `/foods/log/water/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'heartRateTimeSeries'                             ? endpoint = `/activities/heart/date/${date}/${period}.json` : '/profile.json';
    endpointInfo.name === 'sleepLogsList'                                   ? endpoint = `/sleep/list.json?beforeDate=${date}&sort=desc&offset=0&limit=7` : '/profile.json'; // will have to change this

    dataGetters.push(function(connectInfo, user) {
      return new Promise(function(resolve, reject) {
        // Get the data from the provider
        client.get(`${endpoint}`, connectInfo.accessToken, connectInfo.userId)
        .then(result => {
          resolve({[endpointInfo.name]: result});
        })
        .catch(err => {
          console.log('fitbit api call err: ', err);
          reject(err);
        });
      });
    });
  });
  return dataGetters;
}

export function getFitbitData(connectInfo, reqrInfo, user, accu) {
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
