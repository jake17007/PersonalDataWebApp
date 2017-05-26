'use strict';

var FitbitApiClient = require('fitbit-node'),
  client = new FitbitApiClient(process.env.FITBIT_ID, process.env.FITBIT_SECRET);
/*
function getFitbitData(accessToken, userId, callback) {
  console.log('getFitbitData ran');
  client.get("/profile.json", accessToken, userId)
  .then(results => {
    console.log('this ran too')
    callback(results);
  });
}
*/

function handleExpiredAccessToken(user) {
  return function(apiCallResult) {
    //console.log('apiCallResult: ', apiCallResult);
    // Send the result if the call was successful
    if (apiCallResult[0].success !== false) {
      return apiCallResult;
    }
    console.log(apiCallResult[0].errors);
    // Get a new access token if there is an expired_token error
    if (apiCallResult[0].errors.filter(error => {
      return error.errorType === 'expired_token'
    }).length > 0) {

      var fitbitConnection = user.connections.filter(connection => {
        return connection.provider === 'fitbit';
      })[0];

      console.log('fitbit connection: ', fitbitConnection);

      console.log('accessToken: ', fitbitConnection.accessToken);
      console.log('refreshToken: ', fitbitConnection.refreshToken);

      return client.refreshAccessToken(fitbitConnection.accessToken, fitbitConnection.refreshToken)
      .then(result => {
        console.log('refreshAccessToken result: ', result);
        return(result);
      })
      .catch(err => {
        console.log('refreshAccessToken error result: ', err);
        console.log('the error: ', err.context.errors);
        return(err);
      });
      //return 'there is was an expired token error';
    }
    return 'something went wrong with the api call other than an expired token';
  };
}


export function getFibitDataGettersByEndpoints(endpoints) {
  dataGetters = [];
  endpoints.forEach(endpoint => {

    var date = '2017-02-01'; // Temporary, implement current date later
    var period = '1m' // Temporary, can implement options someday

    var endpoint;
    endpoint.name === 'dailyActivitySummary'                            ? endpoint = `/activities/date/${date}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-calories'                     ? endpoint = `/activities/calories/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-caloriesBmr'                  ? endpoint = `/activities/caloriesBMR/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-steps'                        ? endpoint = `/activities/steps/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-distance'                     ? endpoint = `/activities/distance/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-floors'                       ? endpoint = `/activities/floors/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-elevation'                    ? endpoint = `/activities/elevation/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-minutesSedentary'             ? endpoint = `/activities/minutesSedentary/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-minutesLightlyActive'         ? endpoint = `/activities/minutesLightlyActive/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-minutesFairlyActive'          ? endpoint = `/activities/minutesFairlyActive/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-minutesVeryActive'            ? endpoint = `/activities/minutesVeryActive/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-activityCalories'             ? endpoint = `/activities/activityCalories/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-calories'             ? endpoint = `/activities/tracker/calories/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-steps'                ? endpoint = `/activities/tracker/steps/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-distance'             ? endpoint = `/activities/tracker/distance/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-floors'               ? endpoint = `/activities/tracker/floors/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-elevation'            ? endpoint = `/activities/tracker/elevation/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-minutesSedentary'     ? endpoint = `/activities/tracker/minutesSedentary/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-minutesLightlyActive' ? endpoint = `/activities/tracker/minutesLightlyActive/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-minutesFairlyActive'  ? endpoint = `/activities/tracker/minutesFairlyActive/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-minutesVeryActive'    ? endpoint = `/activities/tracker/minutesVeryActive/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'activityTimeSeries-tracker-activityCalories'     ? endpoint = `/activities/tracker/activityCalories/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'bodyTimeSeries-bmi'                              ? endpoint = `/body/bmi/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'bodyTimeSeries-fat'                              ? endpoint = `/body/fat/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'bodyTimeSeries-weight'                           ? endpoint = `/body/weight/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'foodOrWaterTimeSeries-caloresIn'                 ? endpoint = `/foods/log/caloriesIn/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'foodOrWaterTimeSeries-water'                     ? endpoint = `/foods/log/water/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'heartRateTimeSeries'                             ? endpoint = `/activities/heart/date/${date}/${period}.json` : '/profile.json';
    endpoint.name === 'sleepLogsList'                                   ? endpoint = `/sleep/list.json?beforeDate=${date}&sort=desc&offset=0&limit=7` : '/profile.json'; // will have to change this





    dataGetters.push(function getFitbitData(userRequiredApiInfo, user) {
      return new Promise(function(resolve, reject) {
        try {
          console.log('getFitbitData ran');
          // Get just the connection info for this provider
          var connectInfo = userRequiredApiInfo.filter(connection => {
            return connection.provider === 'fitbit';
          })[0];

          console.log('connectInfo.accessToken: ', connectInfo.accessToken);
          // Get the data from the provider
          client.get(`${endpoint}`, connectInfo.accessToken, connectInfo.userId)
          //.then(handleExpiredAccessToken(user))
          .then(result => {
            //console.log('heres the result after handling the response: ', result);
            resolve({fitbit: result});
            return result;
          })
          .catch(err => {
            console.log('fitbit api call err: ', err);
            reject(err);
          });
        } catch(err) {
          reject(err);
        }
      });
    });
  });
  return dataGetters;
}





function refreshAccessToken(userConnectionInfo) {

}
