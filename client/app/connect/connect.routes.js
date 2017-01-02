'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('connect', {
      url: '/connect',
      template: '<connect></connect>'
    });
}
