import passport from 'passport';
import {Strategy as WithingsStrategy} from 'passport-withings';
import {upsertConnection} from '../connect.service';

export function setup(User, config) {
  passport.use(new WithingsStrategy({
    consumerKey: config.withings.clientID,
    consumerSecret: config.withings.clientSecret,
    callbackURL: config.withings.callbackURL,
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    console.log('req: ', req);
    console.log('token: ', token);
    console.log('tokenSecret: ', tokenSecret);
    console.log('profile: ', profile);
    upsertConnection('withings', req.user._id, token, tokenSecret, profile.id, done);
  }));
}
