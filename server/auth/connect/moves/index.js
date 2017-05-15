'use strict';

import express from 'express';
import passport from 'passport';
import {isAuthenticated} from '../../auth.service';

var router = express.Router();

router
  .get('/', isAuthenticated(), passport.authenticate('moves',
    {
      scope: [
        'default',
        'activity',
        'location'],
      failureRedirect: '/',
      session: false
    }))
  .get('/callback', isAuthenticated(), passport.authenticate('moves', {
        failureRedirect: '/',
        session: false
    }), function(req, res) {
      res.redirect('/connect');
    });

export default router;
