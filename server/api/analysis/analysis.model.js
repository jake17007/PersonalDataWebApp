'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

export var AnalysisSchema = new mongoose.Schema({
  ownerId: String,
  name: String,
  githubLink: String,
  description: String,
  thirdPartyApiRequirements: [{
    provider: String,
    label: String,
    endpoints: [{
      name: String,
      label: String,
      requiredScopes: [String]
    }]
  }]
});

export default mongoose.model('Analysis', AnalysisSchema);
