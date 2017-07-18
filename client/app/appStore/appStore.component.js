'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './appStore.routes';

export class AppStoreComponent {
  apps= [];

  /*@ngInject*/
  constructor($http, $scope, $state) {
    this.message = 'Hello';
    this.$http = $http;
    this.$state = $state;
  }

  $onInit() {
    this.$http.get('/api/analyses/forAppStorePage/all')
      .then(response => {
        this.apps = response.data;


        this.apps.forEach(app => {
          var reqrString = '';
          app.thirdPartyApiRequirements.forEach(reqr => {
            reqrString += (reqr.thirdPartyApi.label + ', ');
          })
          reqrString = reqrString.replace(/,\s*$/, "");
          app.reqrString = reqrString;
        })
      });
  }

  viewAppDetails(theApp) {
    this.$state.go('appDetails', {app: theApp});
  }
}

export default angular.module('hh7App.appStore', [uiRouter])
  .config(routes)
  .component('appStore', {
    template: require('./appStore.html'),
    controller: AppStoreComponent,
    controllerAs: 'appStoreCtrl'
  })
  .name;
