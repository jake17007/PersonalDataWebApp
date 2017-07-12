import passport from 'passport';
var YoutubeV3Strategy = require('passport-youtube-v3').Strategy
import {upsertConnection} from '../connect.service';

export function setup(User, config) {
  passport.use(new YoutubeV3Strategy({
      clientID: config.youtube.clientID,
      clientSecret: config.youtube.clientSecret,
      callbackURL: config.youtube.callbackURL,
      scope: ['https://www.googleapis.com/auth/youtube.readonly'],
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        console.log('accessToken: ', accessToken);
        console.log('refreshToken: ', refreshToken);
        console.log('profile: ', profile);
        upsertConnection('youtube', req.user._id, accessToken, refreshToken, profile.id, done);
    }
  ));
}
