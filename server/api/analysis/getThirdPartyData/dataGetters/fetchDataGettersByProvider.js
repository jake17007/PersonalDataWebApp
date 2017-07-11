'use strict';

//import {getFitbitDataGettersByEndpoints, checkForFitbitErrors} from './fitbit';
import {getFitbitData} from './fitbit/fitbit';
import {getMovesData} from './moves/moves';

/*
import * from './facebook';
import * from './moves';
import * from './twothreeandme';
*/
export function fetchDataGettersByProvider(connectInfo, reqrInfo, user) {
  if (reqrInfo.thirdPartyApi.provider === 'fitbit') {
    return getFitbitData(connectInfo, reqrInfo, user);
  }
  if (reqrInfo.thirdPartyApi.provider === 'moves') {
    return getMovesData(connectInfo, reqrInfo, user);
  }
  /*
  if (provider === 'twothreeandme') return getTwothreeandmeData;
  */
}
