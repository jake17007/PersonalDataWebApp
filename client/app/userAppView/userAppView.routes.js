'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('userAppView', {
      url: '/app/:appName',
      template: '<user-app-view></user-app-view>',
      params: {'appId':null, 'appName':null}
    });
}
