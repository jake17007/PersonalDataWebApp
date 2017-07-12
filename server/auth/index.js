'use strict';
import express from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';

// Passport Configuration
// -- Login Authentications
require('./local/passport').setup(User, config);
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);

// -- Connect Authentication
require('./connect/fitbit/passport').setup(User, config);
require('./connect/moves/passport').setup(User, config);
require('./connect/withings/passport').setup(User, config);
require('./connect/youtube/passport').setup(User, config);

var router = express.Router();


// -- Login Router
router.use('/local', require('./local').default);
router.use('/facebook', require('./facebook').default);
router.use('/google', require('./google').default);

// -- Connect Router
router.use('/connect/fitbit', require('./connect/fitbit').default);
router.use('/connect/moves', require('./connect/moves').default);
router.use('/connect/withings', require('./connect/withings').default);
router.use('/connect/youtube', require('./connect/youtube').default);

export default router;
