'use strict';

import mongoose from 'mongoose';

var EndpointSchema = new mongoose.Schema({
  name: String,
  label: String,
  documentationLink: String,
  requiredScopes: [String],
  description: String
});

export default mongoose.model('Endpoint', EndpointSchema);
