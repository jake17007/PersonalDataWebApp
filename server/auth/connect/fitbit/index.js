'use strict';

import express from 'express';
import passport from 'passport';
import {isAuthenticated} from '../../auth.service';

var router = express.Router();

router
  .get('/', isAuthenticated(), passport.authenticate('fitbit',
    {
      scope: [
        'activity',
        'heartrate',
        'location',
        'nutrition',
        'profile',
        'settings',
        'sleep',
        'social',
        'weight'],
      failureRedirect: '/',
      session: false
    }))
  .get('/callback', isAuthenticated(), passport.authenticate('fitbit', {
        failureRedirect: '/',
        session: false
    }), function(req, res) {
      res.redirect('/connect');
    });

export default router;
