'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

export var ConnectionSchema = new Schema({
  provider: String,
  accessToken: String,
  refreshToken: String,
  providerUserId: String
});

/*
UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if(!this.isModified('password')) {
      return next();
    }

    if(!validatePresenceOf(this.password)) {
      if(authTypes.indexOf(this.provider) === -1) {
        return next(new Error('Invalid password'));
      } else {
        return next();
      }
    }

  });

ConnectionSchema.methods = {


  encryptToken(token, salt, callback) {

  }
}
*/
//export default mongoose.model('Connection', ConnectionSchema);
