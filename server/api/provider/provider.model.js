'use strict';

import mongoose from 'mongoose';

var ProviderSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Provider', ProviderSchema);
