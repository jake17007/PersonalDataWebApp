'use strict';

import mongoose from 'mongoose';

export var AnalysisSchema = new mongoose.Schema({
  ownerId: String,
  name: String,
  githubLink: String,
  description: String,
  thirdPartyApiRequirements: [{provider: String, required: Boolean, label: String}]
});

export default mongoose.model('Analysis', AnalysisSchema);
