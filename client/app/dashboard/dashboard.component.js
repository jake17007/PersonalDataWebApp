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
  }

  $onInit() {
    this.$http.get('api/analyses/user/myFavoriteApps')
    .then(response => {
      this.favoriteApps = response.data;
    });
  }

  viewUserAppView(theAppId, theAppName) {
    this.$state.go('userAppView', {appId: theAppId, appName: theAppName});
  }

  removeFromFavorites(app) {
    this.$http.put(`api/users/removeAppFromFavorites/${app._id}`)
    .then(() => {
      return this.$http.get('api/analyses/user/myFavoriteApps');
    })
    .then(response => {
        this.favoriteApps = response.data;
    });
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
