'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './createNewApp.routes';

export class CreateNewAppComponent {
  newAppGithubLink = '';
  requirements = [];

  /*@ngInject*/
  constructor($http, $state) {
    this.message = 'Hello';
    this.$http = $http;
    this.requirements = [
      {provider: 'fitbit', required: false, label: 'Fitbit'},
      {provider: 'facebook', required: false, label: 'Facebook'},
      {provider: 'twentythreeandme', required: false, label: '23andMe'}
    ]
    this.$state = $state;
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
      }).
      then(() => {
        this.$state.go('developers');
      })
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
