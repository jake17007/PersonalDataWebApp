'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './editOwnedApp.routes';

export class EditOwnedAppComponent {
  /*@ngInject*/
  constructor($stateParams, $http, $state) {
    this.message = 'Hello';
    this.appUnchanged = $stateParams.app;
    this.appWithChanges = this.appUnchanged;
    this.$http = $http;
    this.$state = $state;
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
    controller: ['$stateParams', '$http', '$state', EditOwnedAppComponent],
    controllerAs: 'editOwnedAppCtrl'
  })
  .name;
