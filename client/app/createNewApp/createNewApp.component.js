'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './createNewApp.routes';

export class CreateNewAppComponent {
  newAppGithubLink = '';
  requirements = [];

  /*@ngInject*/
  constructor($http) {
    this.message = 'Hello';
    this.$http = $http;
    this.requirements = [
      {provider: 'fitbit', required: false, label: 'Fitbit'},
      {provider: 'facebook', required: false, label: 'Facebook'},
      {provider: 'twentythreeandme', required: false, label: '23andMe'}
    ]
  }

  createNewAppSubmit() {
    console.log('created');
    console.log(this.requirements);
    if(this.newAppGithubLink) {
      console.log('yep');
      this.$http.post('/api/analyses', {
        name: this.newAppName,
        githubLink: this.newAppGithubLink,
        thirdPartyApiRequirements: this.requirements
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
