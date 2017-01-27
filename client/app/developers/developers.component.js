'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './developers.routes';

export class DevelopersComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('hh7App.developers', [uiRouter])
  .config(routes)
  .component('developers', {
    template: require('./developers.html'),
    controller: DevelopersComponent,
    controllerAs: 'developersCtrl'
  })
  .component('createNewAnalysis', {
    template: require('./createNewAnalysis/createNewAnalysis.html'),
    controller: DevelopersComponent,
    controllerAs: 'developersCtrl'
  })
  .name;
