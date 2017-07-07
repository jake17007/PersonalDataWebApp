import passport from 'passport';
import {FitbitOAuth2Strategy as FitbitStrategy} from 'passport-fitbit-oauth2';
import {upsertConnection} from '../connect.service';

export function setup(User, config) {
  passport.use(new FitbitStrategy({
    clientID: config.fitbit.clientID,
    clientSecret: config.fitbit.clientSecret,
    callbackURL: config.fitbit.callbackURL,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    upsertConnection('fitbit', req.user._id, accessToken, refreshToken, profile.id, done);
  }));
}
