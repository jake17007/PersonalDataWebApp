/**
 * ThirdPartyApi model events
 */

'use strict';

import {EventEmitter} from 'events';
import ThirdPartyApi from './thirdPartyApi.model';
var ThirdPartyApiEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ThirdPartyApiEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  ThirdPartyApi.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ThirdPartyApiEvents.emit(event + ':' + doc._id, doc);
    ThirdPartyApiEvents.emit(event, doc);
  };
}

export default ThirdPartyApiEvents;
