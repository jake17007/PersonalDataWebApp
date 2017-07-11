'use strict';
/*eslint no-invalid-this:0*/
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

export var HumanApiConnectionSchema = new Schema({
  accessToken: String,
  publicToken: String,
  humanId: String,
  availableScopes: [String]
});
