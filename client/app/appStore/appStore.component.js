'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './appStore.routes';
import AppDetailsComponent from './appDetails/appDetails.component'

export class AppStoreComponent {
  apps= [];

  /*@ngInject*/
  constructor($http, $scope, $state) {
    this.message = 'Hello';
    this.$http = $http;
    this.$state = $state;
  }

  $onInit() {
    this.$http.get('/api/analyses')
      .then(response => {
        this.apps = response.data;
      });
  }

  viewAppDetails(theApp) {
    this.$state.go('appDetails', {app: theApp});
  }
}

export default angular.module('hh7App.appStore', [uiRouter, AppDetailsComponent])
  .config(routes)
  .component('appStore', {
    template: require('./appStore.html'),
    controller: AppStoreComponent,
    controllerAs: 'appStoreCtrl'
  })
  .name;
