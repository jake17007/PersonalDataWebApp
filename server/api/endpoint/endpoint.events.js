/**
 * Endpoint model events
 */

'use strict';

import {EventEmitter} from 'events';
import Endpoint from './endpoint.model';
var EndpointEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EndpointEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Endpoint.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    EndpointEvents.emit(event + ':' + doc._id, doc);
    EndpointEvents.emit(event, doc);
  };
}

export default EndpointEvents;
