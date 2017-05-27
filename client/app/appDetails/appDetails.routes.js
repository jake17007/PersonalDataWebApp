'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('appDetails', {
      url: '/appDetails',
      template: '<app-details></app-details>',
      params: {app: null}
    });
}
