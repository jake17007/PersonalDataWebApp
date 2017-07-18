'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './userAppView.routes';

export class UserAppViewComponent {
  appOutput = null;
  missingConnections = null;

  /*@ngInject*/
  constructor($stateParams, $http, $sce) {
    this.message = 'Hello';
    this.appId = $stateParams.appId;
    this.appName = $stateParams.appName;
    this.$http = $http;
    this.$sce = $sce;
    this.loading = true;
  }

  $onInit() {
    this.$http.get(`/api/analyses/runApp/${this.appId}`)
      .then(response => {
        this.loading = false;
        this.appOutput = this.$sce.trustAsHtml(response.data.html);
      })
      .catch(err => {
        this.loading = false;
        throw(err.data);
        this.missingConnections = err.data;
      });
  }

}

export default angular.module('hh7App.userAppView', [uiRouter])
  .config(routes)
  .component('userAppView', {
    template: require('./userAppView.html'),
    controller: ['$stateParams', '$http', '$sce', UserAppViewComponent],
    controllerAs: 'userAppViewCtrl'
  })
  .name;
