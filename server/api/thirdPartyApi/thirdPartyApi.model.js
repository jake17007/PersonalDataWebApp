'use strict';

import mongoose from 'mongoose';

var ThirdPartyApiSchema = new mongoose.Schema({
  provider: String,
  required: Boolean,
  label: String,
  scopes: [String],
  endpoints: [{
    name: String,
    label: String,
    documentationLink: String,
    requiredScopes: [String],
    description: String,
    required: Boolean
  }]
});

export default mongoose.model('ThirdPartyApi', ThirdPartyApiSchema);
