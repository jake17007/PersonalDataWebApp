'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './connect.routes';

export class ConnectComponent {
  /*@ngInject*/
  constructor(Auth, $window) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.window = $window;
  }

  connectAcct(provider) {
    this.window.location.href = `/auth/connect/${provider}`;
  }
}

export default angular.module('hh7App.connect', [uiRouter])
  .config(routes)
  .component('connect', {
    template: require('./connect.html'),
    controller: ConnectComponent,
    controllerAs: 'connectCtrl'
  })
  .name;
