'use strict';


var MovesApi = require('moves-api').MovesApi;



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

export function getMovesDataGettersByEndpoints(endpoints) {
  var dataGetters = [];
  endpoints.forEach(endpoint => {

    var date_from = '20170501'; // Temporary, implement current date later
    var date_to = '20170525'; // Temporary, can implement options someday

    var endpointFunction;
    if (endpoint.name === 'profile') {
      dataGetters.push(
        function getMovesData(userRequiredApiInfo, user) {
          return new Promise(function(resolve, reject) {
            try {
              console.log('getMovesData ran');
              // Get just the connection info for this provider
              var connectInfo = userRequiredApiInfo.filter(connection => {
                return connection.provider === 'moves';
              })[0];

              // Create a moves object with the correct access token and refresh token
              var moves = new MovesApi({
                "clientId": process.env.MOVES_ID,
                  "clientSecret": process.env.MOVES_SECRET,
                  "redirectUri": 'http://localhost:3000/auth/connect/moves/callback',
                  "accessToken": connectInfo.accessToken,
                  "refreshToken" : connectInfo.refreshToken
              })

              // Get the data from the provider
              moves.getProfile(function(err, result) {
                if (err) {
                  //console.log('Moves getProfile err: ', err);
                  reject(err);
                }
                //console.log('Moves getProfile result: ', result);
                resolve({moves: result});
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
        function getMovesData(userRequiredApiInfo, user) {
          return new Promise(function(resolve, reject) {
            try {
              console.log('getMovesData ran');
              // Get just the connection info for this provider
              var connectInfo = userRequiredApiInfo.filter(connection => {
                return connection.provider === 'moves';
              })[0];

              // Create a moves object with the correct access token and refresh token
              var moves = new MovesApi({
                "clientId": process.env.MOVES_ID,
                  "clientSecret": process.env.MOVES_SECRET,
                  "redirectUri": 'http://localhost:3000/auth/connect/moves/callback',
                  "accessToken": connectInfo.accessToken,
                  "refreshToken" : connectInfo.refreshToken
              })

              // Get the data from the provider
              moves.getStoryline({ from: `${date_from}`, to: `${date_to}`, trackPoints: false}, function(err, result) {
                if (err) {
                  //console.log('Moves getProfile err: ', err);
                  reject(err);
                }
                //console.log('Moves getProfile result: ', result);
                resolve({moves: result});
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

function refreshAccessToken(userConnectionInfo) {

}
