'use strict';

import mongoose from 'mongoose';

var AnalysisSchema = new mongoose.Schema({
  name: String,
  githubLink: String,
  thirdPartyApiRequirements: [{provider: String, required: Boolean, label: String}]
});

export default mongoose.model('Analysis', AnalysisSchema);
