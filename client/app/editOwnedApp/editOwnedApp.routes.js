'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('editOwnedApp', {
      url: '/editApp',
      template: '<edit-owned-app></edit-owned-app>',
      params: {app: null}
    });
}
