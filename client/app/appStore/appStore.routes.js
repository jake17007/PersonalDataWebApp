'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('appStore', {
      url: '/appStore',
      template: '<app-store></app-store>'
    });
}
