'use strict';

import {getFitbitDataGettersByEndpoints, checkForFitbitErrors} from './fitbit';
import {getMovesDataGettersByEndpoints} from './moves';

/*
import * from './facebook';
import * from './moves';
import * from './twothreeandme';
*/
function fetchDataGettersByProvider(providerInfo) {
  if (providerInfo.provider === 'fitbit') {
    return getFitbitDataGettersByEndpoints(providerInfo.endpoints);
  }
  if (providerInfo.provider === 'moves') {
    return getMovesDataGettersByEndpoints(providerInfo.endpoints);
  }
  if (provider === 'twothreeandme') return getTwothreeandmeData;
}

export function aggregateDataGetters(app, callback) {
  try {
    var dataGetters = [];
    app.thirdPartyApiRequirements.forEach(providerInfo => {
      dataGetters.push.apply( // extends the dataGetter array w/ more dataGetters
        dataGetters,
        fetchDataGettersByProvider(providerInfo)
      );
    });
    console.log('dataGetters: ', dataGetters);
  } catch(err) {
    callback(err);
  }
  callback(null, dataGetters);
}

export function handleExpiredTokenErrorResponses(returnedData, appAndUserData) {
  return new Promise(function(resolve, reject) {
    try {
      var tokenRefreshers = []
      // checking functions will return refresh functions if an expired token error is found
      returnedData.forEach(response => {
        console.log('current provider: ', response);
        if (response.fitbit) //tokenRefreshers.push(checkForFitbitErrors(response.fitbit, appAndUserData));

        if (response.moves) tokenRefreshers.push(checkForMovesErrors(response.moves, appAndUserData));
        console.log('current tokenRefreshers: ', tokenRefreshers[0]);
      });

      Promise.all(tokenRefreshers)
      .then(apiProvidersToRecall => {
        // Get all the necessary data getters
        var dataGetters = [];
        apiProvidersToRecall.forEach(providerInfo => {
          dataGetters.push.apply( // extends the dataGetter array w/ more dataGetters
            dataGetters,
            fetchDataGettersByProvider(providerInfo)
          );
        });
        resolve(dataGetters);
      })
      .catch(err => {
        reject(err);
      });
    } catch(e) {
      reject(e);
    }

  });
}
