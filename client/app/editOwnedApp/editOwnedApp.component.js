'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './editOwnedApp.routes';

export class EditOwnedAppComponent {


  /*@ngInject*/
  constructor($stateParams, $http, $state, refreshStore, modal) {
    // Get possible refresh data
    if ($stateParams.app) this.appUnchanged = $stateParams.app;
    else this.appUnchanged = refreshStore.getCookieData().app;
    // Set refresh data
    refreshStore.setCookieData({app: this.appUnchanged});
    this.appWithChanges = this.appUnchanged;
    this.$http = $http;
    this.$state = $state;
    this.confirmSaved = modal.confirm.saved(function(theState) {
      theState.go('developers');
    }, this.$state);
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
      // Check (as in, mark the checkbox true) the currently required apis according to appUnchanged
      console.dir(this.appUnchanged);
      console.dir(this.thirdPartyApis);
      this.appUnchanged.thirdPartyApiRequirements.forEach(apiOriginal => {
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

  saveChanges() {
    console.log(this.appWithChanges);
    this.$http.put(`api/analyses/${this.appWithChanges._id}`, this.appWithChanges).
    then(() => {
      this.$state.go('developers');
    });
  }

  deleteApp() {
    this.$http.delete(`api/analyses/${this.appWithChanges._id}`).
    then(() => {
      this.$state.go('developers');
    });
  }

  viewJson() {
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
