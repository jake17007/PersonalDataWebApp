/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import ThirdPartyApi from '../api/thirdPartyApi/thirdPartyApi.model'
import Scope from '../api/scope/scope.model'

Thing.find({}).remove()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
            + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
            + 'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, '
            + 'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep '
            + 'tests alongside code. Automatic injection of scripts and '
            + 'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more '
            + 'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript '
            + 'payload, minifies your scripts/css/images, and rewrites asset '
            + 'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku '
            + 'and openshift subgenerators'
    });
  });
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

ThirdPartyApi.find({}).remove()
  .then(() => {
    // Create thirdParyApi
    ThirdPartyApi.create({
      provider: 'fitbit',
      label: 'Fitbit',
      endpoints: [{
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
        }]
    }, {
      provider: 'moves',
      label: 'Moves',
      endpoints: [{
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
        }]
    });
  })
  .catch(err => {
    console.log('An error occurd in populating the ThirdPartyApis: ', err);
  });
