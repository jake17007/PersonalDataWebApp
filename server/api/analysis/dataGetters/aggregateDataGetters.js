'use strict';

import {getFibitDataGettersByEndpoints} from './fitbit';
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
