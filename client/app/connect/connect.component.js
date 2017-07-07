'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './connect.routes';

export class ConnectComponent {
  /*@ngInject*/
  constructor(Auth, $window, $http) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.window = $window;
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('api/thirdPartyApis/')
    .then(thirdPartyApis => {
      this.thirdPartyApis = thirdPartyApis.data;
    })
    .catch(err => {
      throw(err);
    });
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
