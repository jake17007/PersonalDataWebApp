'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './createNewApp.routes';

export class CreateNewAppComponent {
  newApp = {
      name: null,
      githubLink: null,
      description: null,
      thirdPartyApiRequirements: []
  };

  /*@ngInject*/
  constructor($http, $state, modal) {
    this.$http = $http;
    this.$state = $state;
    this.confirmCreated = modal.confirm.created(function(theState) {
      theState.go('developers');
    }, this.$state);
  }

  $onInit() {
    // Get all available third party api connections
    this.$http.get('/api/thirdPartyApis')
    .then(res => {
      this.thirdPartyApis = res.data;
      // Add a 'collapsed' boolean to each provider for form control
      this.thirdPartyApis.forEach(thirdPartyApi => {
        thirdPartyApi.collapsed = true;
      });
      console.log(this.thirdPartyApis);
    })
    .catch(err => {
      console.log(err);
    });
  }

  createNewAppSubmit() {

    // Format the requirements and store to the newApp
    this.thirdPartyApis.forEach(thirdPartyApi => {
      if (thirdPartyApi.required) {

        // The provider info
        var requiredThirdPartyApi = {
          thirdPartyApi: thirdPartyApi._id,
          endpoints: []
        };

        // The endpoints info
        thirdPartyApi.endpoints.forEach(endpoint => {
          if (endpoint.required) {
            requiredThirdPartyApi.endpoints.push(endpoint._id);
          }
        });

        this.newApp.thirdPartyApiRequirements.push(requiredThirdPartyApi);

      }
    });

    // Send it off to the server to be created
    this.$http.post('/api/analyses', this.newApp).
    then(() => {
      // Show success modal that goes to developers page
      this.confirmCreated(this.newApp.name);
    })
    .catch(err => {
      throw(err);
    });
  }


  toggleDropdown(element) {
    element.collapsed = !element.collapsed;
  }
/*
  childrenChecked(api) {
    if (api.endpoints.filter(endpoint => {
      return endpoint.required === true;
    }).length > 0) {
      return true;
    }
    return false;
  }
*/
  checkOrUncheckParent(api) {
    if (api.endpoints.filter(endpoint => {
      return endpoint.required === true;
    }).length > 0) {
      api.required = true;
    } else {
      api.required = false;
    }
  }

  checkOrUncheckChildren(api) {
    if (api.required === true) { // The parent has been checked manually
      api.endpoints.forEach(endpoint => {
        endpoint.required = true;
      });
    } else { // The parent has been unchecked manually
      api.endpoints.forEach(endpoint => {
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
