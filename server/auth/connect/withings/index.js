'use strict';

import express from 'express';
import passport from 'passport';
import {isAuthenticated} from '../../auth.service';

var router = express.Router();

router
  .get('/',
    isAuthenticated(),
    passport.authenticate('withings', {
      failureRedirect: '/',
      session: false
    }),
    function(req, res) {

    })
  .get('/callback',
    isAuthenticated(),
    passport.authenticate('withings', {
        failureRedirect: '/',
        session: false
    }), function(req, res) {
      console.log('Successful authentication.')
      res.redirect('/connect');
    });

export default router;
