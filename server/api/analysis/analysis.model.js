'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

export var AnalysisSchema = new mongoose.Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  name: String,
  githubLink: String,
  description: String,
  thirdPartyApiRequirements: [{
    thirdPartyApi: {type: Schema.Types.ObjectId, ref: 'Analysis'},
    label: String,
    endpoints: [{type: Schema.Types.ObjectId, ref: 'Endpoint'}]
  }]
});

export default mongoose.model('Analysis', AnalysisSchema);
