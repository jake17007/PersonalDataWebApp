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
  dataGetters = [];
  endpoints.forEach(endpoint => {


    dataGetters.push(

    );
  });
  return dataGetters;
}

export function getMovesData(userRequiredConnectionsInfo, user) {
  return new Promise(function(resolve, reject) {
    try {
      console.log('getMovesData ran');
      // Get just the connection info for this provider
      var connectInfo = userRequiredConnectionsInfo.filter(connection => {
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
      moves.getStoryline({ from: "20170501", to: "20170518", trackPoints: false}, function(err, result) {
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

function refreshAccessToken(userConnectionInfo) {

}
