'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('appStore', {
      url: '/appStore',
      template: '<app-store></app-store>'
    })
    .state('appDetails', {
      url: '/appStore/appDetails',
      template: '<app-details></app-details>',
      params: {app: null}
    });
}
