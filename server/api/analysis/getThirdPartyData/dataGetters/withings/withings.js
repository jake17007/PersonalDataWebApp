'use strict';

import {upsertConnection} from '../../../../../auth/connect/connect.service';

export function getWithingsData(connectInfo, reqrInfo, user, accu) {
  return new Promise(function(resolve, reject) {
    console.log(JSON.stringify(connectInfo, null, 2));
    var options = {
      consumerKey: process.env.WITHINGS_CONSUMER_KEY,
      consumerSecret: process.env.WITHINGS_CONSUMER_SECRET,
      token: connectInfo.accessToken,
      tokenSecret: connectInfo.refreshToken,
      userId: connectInfo.providerUserId,
      timeout: 10000
    };
    console.log(options.userId);

    var withings = require('withings-request')(options);

    withings('measure', 'getmeas', { startdate: 1222819200, enddate: 1223190167 }, function(err, body) {
      if (err) reject(err);
      console.log(body);
      resolve(body);
    });
  });
}
