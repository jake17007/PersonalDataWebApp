'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './createNewApp.routes';

export class CreateNewAppComponent {
  newAppGithubLink = '';

  /*@ngInject*/
  constructor($http, $scope) {
    this.message = 'Hello';
    this.$http = $http;
  }

  createNewAppSubmit() {
    console.log('created');
    if(this.newAppGithubLink) {
      console.log('yep');
      this.$http.post('/api/analyses', {
        name: this.newAppName,
        githubLink: this.newAppGithubLink
      });
      this.newAppName = '';
      this.newAppGithubLink = '';
    }
  }
}



export default angular.module('hh7App.createNewApp', [uiRouter])
  .config(routes)
  .component('createNewApp', {
    template: require('./createNewApp.html'),
    controller: CreateNewAppComponent,
    controllerAs: 'createNewAppCtrl'
  })
  .name;
