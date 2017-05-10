'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('connectionDocs', {
      url: '/developers/connectionDocs',
      template: '<connection-docs></connection-docs>'
    });
}
