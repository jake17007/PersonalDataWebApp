'use strict';

import {getFitbitData} from './fitbit/fitbit';
import {getMovesData} from './moves/moves';
import {getWithingsData} from './withings/withings';

export function fetchDataGettersByProvider(connectInfo, reqrInfo, user) {
  if (reqrInfo.thirdPartyApi.provider === 'fitbit') {
    return getFitbitData(connectInfo, reqrInfo, user);
  }
  if (reqrInfo.thirdPartyApi.provider === 'moves') {
    return getMovesData(connectInfo, reqrInfo, user);
  }
  if (reqrInfo.thirdPartyApi.provider === 'withings') {
    return getWithingsData(connectInfo, reqrInfo, user);
  }
}
