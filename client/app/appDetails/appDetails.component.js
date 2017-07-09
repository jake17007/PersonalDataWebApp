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
  constructor($scope, $stateParams, $http, $state, refreshStore, socket) {
    // Get possible refresh data
    if ($stateParams.app) this.app = $stateParams.app;
    else this.app = refreshStore.getCookieData().app;
    // Set refresh data
    refreshStore.setCookieData({app: this.app});
    this.$scope = $scope;
    this.$http = $http;
    this.$state = $state;
    this.socket = socket;
  }

  $onInit() {

    this.$http.get(`/api/analyses/${this.app._id}`)
    .then(result => {
      this.app = result.data;
    })
    .then(() => {
      return this.$http.get('/api/users/me')
        .catch(err => {throw(err);});
    })
    .then(result => {
      this.user = result.data;
    })
    .then(() => {
      // Populate the requirements for the app
      this.app.thirdPartyApiRequirements.forEach(requirement => {
        this.requirements.push(requirement);
      });

      // Indicate whether this is the owner of the app or not
      if (this.app.owner == this.user._id) {
        this.userIsOwner = true;
      }

    })
    .catch(err => {
      console.log(err);
    });

      //console.log(JSON.stringify(this.app, null, 3));

      //console.log(JSON.stringify(user, null, 3));


      /*
      // Add an element to the requirements array indicating whether the user has the given connection
      this.requirements.forEach(requirement => {
        var userHasConnection = user.connections.filter(connection => {
          return connection.provider === requirement.provider;
        }).length;

        if (userHasConnection) {

        }
        */
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
