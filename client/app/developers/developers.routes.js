'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('developers', {
      url: '/developers',
      template: '<developers></developers>'
    })
    .state('createNewAnalysis', {
      url: '/developers/createNewAnalysis',
      template: '<createNewAnalysis></createNewAnalysis>'
    });
}
