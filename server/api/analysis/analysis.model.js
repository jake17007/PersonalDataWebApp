'use strict';

import mongoose from 'mongoose';

var AnalysisSchema = new mongoose.Schema({
  name: String,
  githubLink: String,
  requirements: [ThirdPartySpec]
});

export default mongoose.model('Analysis', AnalysisSchema);
