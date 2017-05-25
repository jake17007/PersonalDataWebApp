'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('jsonView', {
      url: '/viewJson',
      template: '<json-view></json-view>',
      params: {'app':null}
    });
}
