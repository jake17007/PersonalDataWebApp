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

export function getFitbitData(userRequiredConnectionsInfo, user) {
  return new Promise(function(resolve, reject) {
    try {
      console.log('getFitbitData ran');
      // Get just the connection info for this provider
      var connectInfo = userRequiredConnectionsInfo.filter(connection => {
        return connection.provider === 'fitbit';
      })[0];
      // Get the data from the provider
      client.get("/profile.json", connectInfo.accessToken, connectInfo.userId)
      .then(handleExpiredAccessToken(user))
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
}

function refreshAccessToken(userConnectionInfo) {

}
