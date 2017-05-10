'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('appStore', {
      url: '/appStore',
      template: '<app-store></app-store>'
    })
    .state('appDetails', {
      url: '/appStore/:appName',
      template: '<app-details></app-details>',
      params: {'appId':null, 'appName':null}
    });
}
