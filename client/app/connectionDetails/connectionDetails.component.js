'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './connectionDetails.routes';

export class ConnectionDetailsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('hh7App.connectionDetails', [uiRouter])
  .config(routes)
  .component('connectionDetails', {
    template: require('./connectionDetails.html'),
    controller: ConnectionDetailsComponent,
    controllerAs: 'connectionDetailsCtrl'
  })
  .name;
