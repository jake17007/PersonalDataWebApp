/**
 * ThirdPartySpec model events
 */

'use strict';

import {EventEmitter} from 'events';
import ThirdPartySpec from './thirdPartySpec.model';
var ThirdPartySpecEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ThirdPartySpecEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  ThirdPartySpec.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ThirdPartySpecEvents.emit(event + ':' + doc._id, doc);
    ThirdPartySpecEvents.emit(event, doc);
  };
}

export default ThirdPartySpecEvents;
