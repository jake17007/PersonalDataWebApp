'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './developerGuide.routes';

export class DeveloperGuideComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('hh7App.developerGuide', [uiRouter])
  .config(routes)
  .component('developerGuide', {
    template: require('./developerGuide.html'),
    controller: DeveloperGuideComponent,
    controllerAs: 'developerGuideCtrl'
  })
  .name;
