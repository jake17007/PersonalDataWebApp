'use strict';

var FitbitApiClient = require('fitbit-node'),
  client = new FitbitApiClient(process.env.FITBIT_ID, process.env.FITBIT_SECRET);

function getFitbitData(accessToken, userId, callback) {
  console.log('getFitbitData ran');
  client.get("/profile.json", accessToken, userId)
  .then(results => {
    console.log('this ran too')
    callback(results);
  });
}

function refreshAccessToken(userConnectionInfo) {

}
