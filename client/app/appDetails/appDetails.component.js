'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './appDetails.routes';

export class AppDetailsComponent {
  /*@ngInject*/
  requirements = [];
  userIsOwner = false;
  userHasRequiredConnections = false;

  /*@ngInject*/
  constructor($scope, $stateParams, $http, $state, refreshStore) {
    // Get possible refresh data
    if ($stateParams.app) this.app = $stateParams.app;
    else this.app = refreshStore.getCookieData().app;
    // Set refresh data
    refreshStore.setCookieData({app: this.app});
    this.$scope = $scope;
    this.$http = $http;
    this.$state = $state;
  }

  $onInit() {

    // Get the current user and indicated whether this is the owner of the app or not
    this.$http.get('/api/users/me')
    .then(user => {

      // Populate the requirements for the app
      this.app.thirdPartyApiRequirements.forEach(requirement => {
        this.requirements.push(requirement);
      });

      // Indicate whether this is the owner of the app or not
      var user = user.data;
      if (this.app.ownerId == user._id) {
        this.userIsOwner = true;
      }

      // Add an element to the requirements array indicating whether the user has the given connection
      this.requirements.forEach(requirement => {
        var userHasConnection = user.connections.filter(connection => {
          return connection.provider === requirement.provider;
        }).length;

        if (userHasConnection) {

        }

      })
    })
    .catch(function(err){
      console.log(err);
    });


  }

  addAppToUsersFavorites() {
    this.$http.put(`/api/users/addAppToUsersFavorites/${this.app._id}`)
    .then(() => {
      this.$state.go('dashboard');
    })
    .catch(err => {
      console.log(err);
    });
  }

  viewEditOwnedApp() {
    this.$state.go('editOwnedApp', {app: this.app})
  }

/*
  // Gets the names of all the third party api's required for this app
  populateAppRequirements() {
    this.app.thirdPartyApiRequirements.forEach(requirement => {
      if (requirement.required === true) {
        console.log(requirement)
        this.requirements.push(requirement.label);
      }
    });
    console.log(this.requirements);
    return ['one', 'two', 'three', 'four'];//this.requirements;
  }
  */


}

export default angular.module('hh7App.appDetails', [uiRouter])
  .config(routes)
  .component('appDetails', {
    template: require('./appDetails.html'),
    controller: AppDetailsComponent,
    controllerAs: 'appDetailsCtrl'
  })
  .name;
