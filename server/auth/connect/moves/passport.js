import passport from 'passport';
import {Strategy as MovesStrategy} from 'passport-moves';
import {upsertConnection} from '../connect.service';

export function setup(User, config) {
  passport.use(new MovesStrategy({
    clientID: config.moves.clientID,
    clientSecret: config.moves.clientSecret,
    callbackURL: config.moves.callbackURL,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    console.log(profile.id);
    //upsertConnection('moves', req.user._id, accessToken, refreshToken, profile.id, done);
  }));
}
