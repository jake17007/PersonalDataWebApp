'use strict';

import mongoose from 'mongoose';

var AnalysisSchema = new mongoose.Schema({
  name: String,
  githubLink: String
});

export default mongoose.model('Analysis', AnalysisSchema);
