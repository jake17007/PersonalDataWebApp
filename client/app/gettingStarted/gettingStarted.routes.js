'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('gettingStarted', {
      url: '/gettingStarted',
      template: '<getting-started></getting-started>'
    });
}
