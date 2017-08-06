'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './gettingStarted.routes';

export class GettingStartedComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('hh7App.gettingStarted', [uiRouter])
  .config(routes)
  .component('gettingStarted', {
    template: require('./gettingStarted.html'),
    controller: GettingStartedComponent,
    controllerAs: 'gettingStartedCtrl'
  })
  .name;
