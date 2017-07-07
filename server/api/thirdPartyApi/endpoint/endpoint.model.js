'use strict';

import mongoose, {Schema} from 'mongoose';

export var EndpointSchema = new mongoose.Schema({
  name: String,
  label: String,
  documentationLink: String,
  requiredScopes: [String],
  description: String
});
