'use strict';

import mongoose, {Schema} from 'mongoose';

export var AnalysisSchema = new mongoose.Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  name: String,
  githubLink: String,
  description: String,
  thirdPartyApiRequirements: [{
    thirdPartyApi: {type: Schema.Types.ObjectId, ref: 'ThirdPartyApi'},
    endpoints: [{type: Schema.Types.ObjectId, ref: 'Endpoint'}]
  }]
});

export default mongoose.model('Analysis', AnalysisSchema);
