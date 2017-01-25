'use strict';

import mongoose from 'mongoose';

var RequirementSchema = new mongoose.Schema({
  name: String,
  apiEndpointURL: String,
  required: Boolean
})

var ThirdPartySpecSchema = new mongoose.Schema({
  provider: String,
  requirements: [RequirementSchema]
});

export default mongoose.model('ThirdPartySpec', ThirdPartySpecSchema);
