'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './connectionDocs.routes';

export class ConnectionDocsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('hh7App.connectionDocs', [uiRouter])
  .config(routes)
  .component('connectionDocs', {
    template: require('./connectionDocs.html'),
    controller: ConnectionDocsComponent,
    controllerAs: 'connectionDocsCtrl'
  })
  .name;
