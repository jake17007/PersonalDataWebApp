'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './editOwnedApp.routes';

import _ from 'lodash';

export class EditOwnedAppComponent {


  /*@ngInject*/
  constructor($stateParams, $http, $state, refreshStore, modal) {
    // Get possible refresh data
    if ($stateParams.app) this.appUnchanged = $stateParams.app;
    else this.appUnchanged = refreshStore.getCookieData().app;
    // Set refresh data
    refreshStore.setCookieData({app: this.appUnchanged});
    this.appWithChanges = _.clone(this.appUnchanged);
    this.$http = $http;
    this.$state = $state;
    // Save succes modal
    this.confirmSaved = modal.confirm.saved(function(theState) {
      theState.go('developers');
    }, this.$state);
    // Confirm delete modal
    this.confirmDelete = modal.confirm.delete(function(theHttp, theState, theAppWithChanges) {
      theHttp.delete(`api/analyses/${theAppWithChanges._id}`).
      then(() => {
        theState.go('developers');
      });
    }, this.$http, this.$state, this.appWithChanges);
  }

  $onInit() {
    // Get all available third party api connections
    this.$http.get('/api/thirdPartyApis')
    .then(res => {
      this.thirdPartyApis = res.data;
      // Add a 'collapsed' boolean to each provider for form control
      this.thirdPartyApis.forEach(provider => {
        provider.collapsed = true;
      });
      // Check (as in, mark the checkbox true) the currently required apis according to appUnchanged
      this.appWithChanges.thirdPartyApiRequirements.forEach(apiOriginal => {
        this.thirdPartyApis.forEach(apiEdit => {
          if (apiEdit.provider === apiOriginal.provider) {
            apiEdit.required = true;
            apiOriginal.endpoints.forEach(endpointOriginal => {
              apiEdit.endpoints.forEach(endpointEdit => {
                if (endpointEdit.name === endpointOriginal.name) {
                  endpointEdit.required = true;
                }
              });
            });
          }
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  toggleDropdown(element) {
    element.collapsed = !element.collapsed;
  }

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

  static updateAppWithChanges() {
    this.appWithChanges.thirdPartyApiRequirements = [];
    // Format the requirements and store to the newApp
    this.thirdPartyApis.forEach(provider => {
      if (provider.required) {

        // The provider info
        var requiredProvider = {
          provider: provider.provider,
          label: provider.label,
          endpoints: []
        };

        // The endpoints info
        provider.endpoints.forEach(endpoint => {
          if (endpoint.required) {
            var requiredEndpoint = {
              name: endpoint.name,
              label: endpoint.label,
              requiredScopes: endpoint.requiredScopes
            };

            requiredProvider.endpoints.push(requiredEndpoint);
          }
        });
        this.appWithChanges.thirdPartyApiRequirements.push(requiredProvider)
      }
    });
  }

  saveChanges() {

    // This needs to be turned into a function called updateAppWithChanges
    /********/
    this.appWithChanges.thirdPartyApiRequirements = [];
    // Format the requirements and store to the newApp
    this.thirdPartyApis.forEach(provider => {
      if (provider.required) {

        // The provider info
        var requiredProvider = {
          provider: provider.provider,
          label: provider.label,
          endpoints: []
        };

        // The endpoints info
        provider.endpoints.forEach(endpoint => {
          if (endpoint.required) {
            var requiredEndpoint = {
              name: endpoint.name,
              label: endpoint.label,
              requiredScopes: endpoint.requiredScopes
            };

            requiredProvider.endpoints.push(requiredEndpoint);
          }
        });
        this.appWithChanges.thirdPartyApiRequirements.push(requiredProvider)
      }
    });
    /*********/

    this.$http.put(`api/analyses/${this.appWithChanges._id}`, this.appWithChanges).
    then(() => {
      this.confirmSaved(this.appWithChanges.name);
    });
  }

  deleteApp() {
    /*
    this.$http.delete(`api/analyses/${this.appWithChanges._id}`).
    then(() => {
      this.$state.go('developers');
    });
    */
    this.confirmDelete(this.appUnchanged.name);
  }

  viewJson() {
    // This needs to be turned into a function called updateAppWithChanges
    /********/
    this.appWithChanges.thirdPartyApiRequirements = [];
    // Format the requirements and store to the newApp
    this.thirdPartyApis.forEach(provider => {
      if (provider.required) {

        // The provider info
        var requiredProvider = {
          provider: provider.provider,
          label: provider.label,
          endpoints: []
        };

        // The endpoints info
        provider.endpoints.forEach(endpoint => {
          if (endpoint.required) {
            var requiredEndpoint = {
              name: endpoint.name,
              label: endpoint.label,
              requiredScopes: endpoint.requiredScopes
            };

            requiredProvider.endpoints.push(requiredEndpoint);
          }
        });
        this.appWithChanges.thirdPartyApiRequirements.push(requiredProvider)
      }
    });
    /*********/
    this.$state.go('jsonView', {app: this.appWithChanges});
  }
}

export default angular.module('hh7App.editOwnedApp', [uiRouter])
  .config(routes)
  .component('editOwnedApp', {
    template: require('./editOwnedApp.html'),
    controller: EditOwnedAppComponent,
    controllerAs: 'editOwnedAppCtrl'
  })
  .name;
