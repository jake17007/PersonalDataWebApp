'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './userAppView.routes';

export class UserAppViewComponent {
  appOutput = null;

  /*@ngInject*/
  constructor($stateParams, $http, socket, $scope, $state) {
    this.message = 'Hello';
    this.appId = $stateParams.appId;
    this.appName = $stateParams.appName;
    this.$http = $http;
    this.socket = socket;
  }

  $onInit(socket) {
    this.$http.get('/api/')
      .then(response => {
        this.favoriteApps = response.data.favoriteApps;
        this.socket.syncUpdates()
      });
  }
}

export default angular.module('hh7App.userAppView', [uiRouter])
  .config(routes)
  .component('userAppView', {
    template: require('./userAppView.html'),
    controller: ['$stateParams', UserAppViewComponent],
    controllerAs: 'userAppViewCtrl'
  })
  .name;
