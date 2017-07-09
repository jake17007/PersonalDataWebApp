'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('developerGuide', {
      url: '/developers/developerGuide',
      template: '<developer-guide></developer-guide>'
    });
}
