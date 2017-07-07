'use strict';

import mongoose, {Schema} from 'mongoose';
import {EndpointSchema} from './endpoint/endpoint.model'

var ThirdPartyApiSchema = new mongoose.Schema({
  provider: String,
  label: String,
  endpoints: [EndpointSchema]
});

export default mongoose.model('ThirdPartyApi', ThirdPartyApiSchema);
