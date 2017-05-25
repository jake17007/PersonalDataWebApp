'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './createNewApp.routes';

export class CreateNewAppComponent {
  newAppGithubLink = '';
  description = '';
  requirements = [];
  newApp = {
      name: null,
      githubLink: null,
      shortDescription: null,
      longDescription: null,
      thirdPartyApiRequirements: null
  };


  /*@ngInject*/
  constructor($http, $state) {
    this.message = 'Hello';
    this.$http = $http;
    this.$state = $state;
  }

  $onInit() {
    // Get all available third party api connections
    this.$http.get('/api/thirdPartyApis')
    .then(res => {
      console.log(res);
      this.thirdPartyApis = res.data;
      // Add a 'collapsed' boolean to each provider for form control
      this.thirdPartyApis.forEach(provider => {
        provider.collapsed = true;
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  createNewAppSubmit() {
    this.$http.post('/api/analyses', {
      name: this.newAppName,
      githubLink: this.newAppGithubLink,
      description: this.description,
      thirdPartyApiRequirements: this.requirements
    }).
    then(() => {
      this.$state.go('developers');
    })

  }

  toggleDropdown(element) {
    element.collapsed = !element.collapsed;
  }

  childrenChecked(requirement) {
    if (requirement.endpoints.filter(endpoint => {
      return endpoint.required === true;
    }).length > 0) {
      return true;
    }
    return false;
  }

  checkOrUncheckChildren(requirement) {
    if (requirement.required === true) { // The parent has been checked manually
      requirement.endpoints.forEach(endpoint => {
        endpoint.required = true;
      });
    } else { // The parent has been unchecked manually
      requirement.endpoints.forEach(endpoint => {
        endpoint.required = false;
      });
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
