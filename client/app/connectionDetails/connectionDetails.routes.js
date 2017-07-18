'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('connectionDetails', {
      url: '/connect/connectionDetails',
      template: '<connection-details></connection-details>',
      params: {
        user: null,
        thirdPartyApi: null
      }
    });
}
