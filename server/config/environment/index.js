'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'hh7-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    scope: 'public_profile, user_friends, email',
    callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`
  },

  google: {
    clientID: process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
  },

  fitbit: {
    clientID: process.env.FITBIT_ID || 'id',
    clientSecret: process.env.FITBIT_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/connect/fitbit/callback`
  },

  moves: {
    clientID: process.env.MOVES_ID || 'id',
    clientSecret: process.env.MOVES_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/connect/moves/callback`
  },

  humanApi: {
    clientID: process.env.HUMANAPI_ID || 'id',
    clientSecret: process.env.HUMANAPI_SECRET || 'secret',
    appKey: process.env.HUMANAPI_APPKEY || 'appKey'
  },

  withings: {
    clientID: process.env.WITHINGS_CONSUMER_KEY || 'id',
    clientSecret: process.env.WITHINGS_CONSUMER_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/connect/withings/callback`
  },

  youtube: {
    clientID: process.env.YOUTUBE_ID || 'id',
    clientSecret: process.env.YOUTUBE_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/connect/youtube/callback`
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {});
