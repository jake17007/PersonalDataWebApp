'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './dashboard.routes';

export class DashboardComponent {

  favoriteApps = [];

  /*@ngInject*/
  constructor(Auth, $http, socket, $scope, $state) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$http = $http;
    this.socket = socket;
    this.$state = $state;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('app');
    });
  }

  $onInit(socket) {
    this.$http.get('/api/users/me')
      .then(response => {
        this.favoriteApps = response.data.favoriteApps;
        this.socket.syncUpdates()
      });
  }

  viewUserAppView(theAppId, theAppName) {
    this.$state.go('userAppView', {appId: theAppId, appName: theAppName});
  }

}

export default angular.module('hh7App.dashboard', [uiRouter])
  .config(routes)
  .component('dashboard', {
    template: require('./dashboard.html'),
    controller: DashboardComponent,
    controllerAs: 'dashboardCtrl'
  })
  .name;
