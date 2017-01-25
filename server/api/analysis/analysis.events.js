/**
 * Analysis model events
 */

'use strict';

import {EventEmitter} from 'events';
import Analysis from './analysis.model';
var AnalysisEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AnalysisEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Analysis.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AnalysisEvents.emit(event + ':' + doc._id, doc);
    AnalysisEvents.emit(event, doc);
  };
}

export default AnalysisEvents;
