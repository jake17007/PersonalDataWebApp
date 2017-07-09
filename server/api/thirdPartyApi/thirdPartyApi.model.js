'use strict';

import mongoose, {Schema} from 'mongoose';


var ThirdPartyApiSchema = new mongoose.Schema({
  provider: String,
  label: String,
  endpoints: [{type: Schema.Types.ObjectId, ref: 'Endpoint'}]
});

export default mongoose.model('ThirdPartyApi', ThirdPartyApiSchema);
