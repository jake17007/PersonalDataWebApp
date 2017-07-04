'use strict';

import mongoose from 'mongoose';

var EndpointSchema = new mongoose.Schema({
  label: String,
  requiredScopes: [{type: Schema.Types.ObjectId, ref: 'Scope'}]
});

export default mongoose.model('Endpoint', EndpointSchema);
