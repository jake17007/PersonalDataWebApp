'use strict';

import {getFitbitData} from './fitbit';
import {getMovesData} from './moves';
/*
import * from './facebook';
import * from './moves';
import * from './twothreeandme';
*/
function fetchDataGetterByProvider(provider) {
  if (provider === 'fitbit') return getFitbitData;
  if (provider === 'facebook') return getFacebookData;
  if (provider === 'moves') return getMovesData;
  if (provider === 'twothreeandme') return getTwothreeandmeData;
}

export function aggregateDataGetters(userRequiredConnectionsInfo, callback) {
  try {
    var dataGetters = [];
    userRequiredConnectionsInfo.forEach(connection => {
      dataGetters.push(fetchDataGetterByProvider(connection.provider));
    });
    console.log('dataGetters: ', dataGetters);
  } catch(err) {
    callback(err);
  }
  callback(null, dataGetters);
}
