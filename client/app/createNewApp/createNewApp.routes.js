'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('createNewApp', {
      url: '/developers/createNewApp',
      template: '<create-new-app></create-new-app>'
    });
}
