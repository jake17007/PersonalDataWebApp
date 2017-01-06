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

var router = express.Router();


// -- Login Router
router.use('/local', require('./local').default);
router.use('/facebook', require('./facebook').default);
router.use('/google', require('./google').default);

// -- Connect Router
router.use('/connect/fitbit', require('./connect/fitbit').default);

export default router;
