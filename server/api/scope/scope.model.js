'use strict';

import mongoose from 'mongoose';

var ScopeSchema = new mongoose.Schema({
  name: String,
  label: String
});

export default mongoose.model('Scope', ScopeSchema);
