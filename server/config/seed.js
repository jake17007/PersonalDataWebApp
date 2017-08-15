/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import ThirdPartyApi from '../api/thirdPartyApi/thirdPartyApi.model'
import Endpoint from '../api/endpoint/endpoint.model'
import _ from 'lodash';

/*
User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
*/
/*
var fitbitEndpoints = [
  {
    name: 'profile',
    label: 'Profile',
    documentationLink: 'https://dev.fitbit.com/docs/user/#get-profile',
    requiredScopes: [

    ],
    description: ''
  },
  {
    name: 'dailyActivitySummary',
    label: 'Daily Activity Summary',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#get-daily-activity-summary',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-calories',
    label: 'Activity Time Series - Calories',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  },{
    name: 'activityTimeSeries-caloriesBmr',
    label: 'Activity Time Series - Calories BMR',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-steps',
    label: 'Activity Time Series - Steps',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-distance',
    label: 'Activity Time Series - Distance',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-floors',
    label: 'Activity Time Series - Floors',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-elevation',
    label: 'Activity Time Series - Elevation',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-minutesSedentary',
    label: 'Activity Time Series - Minutes Sedentary',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-minutesLightlyActive',
    label: 'Activity Time Series - Minutes Lightly Active',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-minutesFairlyActive',
    label: 'Activity Time Series - Minutes Fairly Active',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-minutesVeryActive',
    label: 'Activity Time Series - Minutes Very Active',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-activityCalories',
    label: 'Activity Time Series - Activity Calories',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-calories',
    label: 'Activity Time Series - Tracker - Calories',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-steps',
    label: 'Activity Time Series - Tracker - Steps',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-distance',
    label: 'Activity Time Series - Tracker - Distance',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-floors',
    label: 'Activity Time Series - Tracker - Floors',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-elevation',
    label: 'Activity Time Series - Tracker - Elevation',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-minutesSedentary',
    label: 'Activity Time Series - Tracker - Minutes Sedentary',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-minutesLightlyActive',
    label: 'Activity Time Series - Tracker - Minutes Lightly Active',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-minutesFairlyActive',
    label: 'Activity Time Series - Tracker - Minutes Fairly Active',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-minutesVeryActive',
    label: 'Activity Time Series - Tracker - Minutes Very Active',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'activityTimeSeries-tracker-activityCalories',
    label: 'Activity Time Series - Tracker - Activity Calories',
    documentationLink: 'https://dev.fitbit.com/docs/activity/#activity-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'bodyTimeSeries-bmi',
    label: 'Body Time Series - BMI',
    documentationLink: 'https://dev.fitbit.com/docs/body/#body-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'bodyTimeSeries-fat',
    label: 'Body Time Series - Fat',
    documentationLink: 'https://dev.fitbit.com/docs/body/#body-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'bodyTimeSeries-weight',
    label: 'Body Time Series - Weight',
    documentationLink: 'https://dev.fitbit.com/docs/body/#body-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'foodOrWaterTimeSeries-caloresIn',
    label: 'Food or Water Time Series - Calories In',
    documentationLink: 'https://dev.fitbit.com/docs/food-logging/#food-or-water-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'foodOrWaterTimeSeries-water',
    label: 'Food or Water Time Series - Water',
    documentationLink: 'https://dev.fitbit.com/docs/food-logging/#food-or-water-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'heartRateTimeSeries',
    label: 'Heart Rate Time Series',
    documentationLink: 'https://dev.fitbit.com/docs/heart-rate/#get-heart-rate-time-series',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'sleepLogsList',
    label: 'Sleep Logs List',
    documentationLink: 'https://dev.fitbit.com/docs/sleep/#get-sleep-logs-list',
    requiredScopes: [

    ],
    description: ''
  }
];

var movesEndpoints = [
  {
    name: 'profile',
    label: 'Profile',
    documentationLink: 'https://dev.moves-app.com/docs/api_profile',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'storyLine',
    label: 'Storyline',
    documentationLink: 'https://dev.moves-app.com/docs/api_storyline',
    requiredScopes: [

    ],
    description: ''
  }
];

console.log('fitbitEndpoints.length: ', fitbitEndpoints.length);

var fitbitEndpointIds = [];

function createEndpoint(endpoint) {
  return new Promise(function(resolve, reject) {
    Endpoint.create(endpoint)
    .then(result => {
      resolve(result._id);
    })
    .catch(err => {
      reject(err);
    });
  });
}

function endpointAdders(fitbitEndpoints) {
  return _.map(fitbitEndpoints, createEndpoint);
}

function createEndpoints(endpoints) {
  return function() {
    return Promise.all(endpointAdders(endpoints));
  }
}

Endpoint.find({}).remove()
  .then(createEndpoints(fitbitEndpoints))
  .then(ids => {
    return ThirdPartyApi.find({}).remove()
    .then(() => {
      return ThirdPartyApi.create({
        provider: 'fitbit',
        label: 'Fitbit',
        endpoints: ids
      });
    });
  })
  .then(createdThirdPartyApi => {
    console.log(JSON.stringify(createdThirdPartyApi, null, 2));
  })
  .then(createEndpoints(movesEndpoints))
  .then(ids => {
    return ThirdPartyApi.create({
      provider: 'moves',
      label: 'Moves',
      endpoints: ids
    });
  })
  .then(createdThirdPartyApi => {
    console.log(JSON.stringify(createdThirdPartyApi, null, 2));
  })
  .catch(err => {
    throw(err);
  });
*/

/*
var withingsEndpoints = [
  {
    name: 'profile',
    label: 'Profile',
    documentationLink: 'https://dev.moves-app.com/docs/api_profile',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'storyLine',
    label: 'Storyline',
    documentationLink: 'https://dev.moves-app.com/docs/api_storyline',
    requiredScopes: [

    ],
    description: ''
  }
];

console.log('fitbitEndpoints.length: ', fitbitEndpoints.length);

var fitbitEndpointIds = [];
*/
function createEndpoint(endpoint) {
  return new Promise(function(resolve, reject) {
    Endpoint.create(endpoint)
    .then(result => {
      resolve(result._id);
    })
    .catch(err => {
      reject(err);
    });
  });
}

function endpointAdders(endpoints) {
  return _.map(endpoints, createEndpoint);
}

function createEndpoints(endpoints) {
  return function() {
    return Promise.all(endpointAdders(endpoints));
  }
}
/*
Endpoint.find({}).remove()
  .then(createEndpoints(fitbitEndpoints))
  .then(ids => {
    return ThirdPartyApi.find({}).remove()
    .then(() => {
      return ThirdPartyApi.create({
        provider: 'fitbit',
        label: 'Fitbit',
        endpoints: ids
      });
    });
  })
  .then(createdThirdPartyApi => {
    console.log(JSON.stringify(createdThirdPartyApi, null, 2));
  })
  .then(createEndpoints(movesEndpoints))
  .then(ids => {
    return ThirdPartyApi.create({
      provider: 'moves',
      label: 'Moves',
      endpoints: ids
    });
  })
  .then(createdThirdPartyApi => {
    console.log(JSON.stringify(createdThirdPartyApi, null, 2));
  })
  .catch(err => {
    throw(err);
  });
*/
/*
ThirdPartyApi.create({
  provider: 'withings',
  label: 'Withings',
  endpoints: null
});
*/
/*
var withingsEndpoints = [
  {
    name: 'getactivity',
    label: 'Measure - Get Activity Measures',
    documentationLink: 'https://developer.health.nokia.com/api/doc#api-Measure-get_activity',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'getmeas',
    label: 'Measure - Get Body Measures',
    documentationLink: 'https://developer.health.nokia.com/api/doc#api-Measure-get_measure',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'getintradayactivity',
    label: 'Measure - Get Intraday Activity',
    documentationLink: 'https://developer.health.nokia.com/api/doc#api-Measure-get_intraday_measure',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'get',
    label: 'Measure - Get Sleep Measures',
    documentationLink: 'https://developer.health.nokia.com/api/doc#api-Measure-get_sleep',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'getsummary',
    label: 'Measure - Get Sleep Summary',
    documentationLink: 'https://developer.health.nokia.com/api/doc#api-Measure-get_sleep_summary',
    requiredScopes: [

    ],
    description: ''
  }, {
    name: 'getworkouts',
    label: 'Measure - Get Workouts',
    documentationLink: 'https://developer.health.nokia.com/api/doc#api-Measure-get_workouts',
    requiredScopes: [

    ],
    description: ''
  }
];
*/
/*
Promise.all(endpointAdders(withingsEndpoints))
.then(ids => {
  ThirdPartyApi.find({provider: 'withings'}).exec()
  .then(thirdPartyApi => {
    thirdPartyApi.endpoints.push(ids);
    thirdPartyApi.save()
      .then(savedThirdPartyApi => {
        console.log(JSON.stringify(savedThirdPartyApi, null, 2));
      });
    });
  })
  .catch(err => {
    throw(err);
  });
*/
/*
Endpoint.find({documentationLink: new RegExp('nokia')}).exec()
.then(withingsEndpoints => {
  var ids = _.map(withingsEndpoints, '_id');
  ThirdPartyApi.find({provider: 'withings'}).remove()
  .then(() => {
    ThirdPartyApi.create({
      provider: 'withings',
      label: 'Withings',
      endpoints: ids
    });
  });
})
.catch(err => {
  throw(err);
});
*/
/*
ThirdPartyApi.create({
  provider: 'youtube',
  label: 'YouTube',
  endpoints: []
})
.then(result => {
  console.log('result: ', result);
})
.catch(err => {
  throw(err);
})
*/
/*
Endpoint.create({
  name: 'channelStatistics',
  label: 'Channel Statistics',
  documentationLink: 'https://developers.google.com/youtube/v3/docs/channels/list',
  requiredScopes: [

  ],
  description: ''
})
.then(console.log)
.catch(console.log)
*/
/*
ThirdPartyApi.find({'_id': '596644837344833ea82bfa36'})
  .then(thirdPartyApi => {
    return Endpoint.create({
      name: 'channelStatistics',
      label: 'Channel Statistics',
      documentationLink: 'https://developers.google.com/youtube/v3/docs/channels/list',
      requiredScopes: [

      ],
      description: ''
    })
    .then(endpoint => {
      thirdPartyApi.endpoints.push(endpoint._id);
      thirdPartyApi.save()
        .then(savedThirdPartyApi => {
          console.log(JSON.stringify(savedThirdPartyApi, null, 2));
        });
    });
  })
  .catch(err => {
    console.log(err);
  });
*/
/*
ThirdPartyApi.findById('596644837344833ea82bfa36')
.then(thirdPartyApi => {
  thirdPartyApi.endpoints.push('59934771e2c3572817963341')
  thirdPartyApi.save();
})
.catch(console.log);
*/
