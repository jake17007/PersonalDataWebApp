'use strict';
const angular = require('angular');

export class AppDetailsComponent {

  requirements = [];
  userIsOwner = false;

  /*@ngInject*/
  constructor($scope, $stateParams, $http, $state) {
    this.message = 'World';
    this.$scope = $scope;
    this.$http = $http;
    this.app = $stateParams.app;
    this.$state = $state;
  }

  $onInit() {
    // Populate this.requirements with names of the third party api's required for this app
    this.app.thirdPartyApiRequirements.forEach(requirement => {
      if (requirement.required === true) {
        this.requirements.push(requirement.label);
      }
    });

    // Get the current user and indicated whether this is the owner of the app or not
    this.$http.get('/api/users/me')
    .then(res => {
      var userId = res.data._id;
      if (this.app.ownerId == userId) {
        this.userIsOwner = true;
      }
    })
  }

  addAppToUsersFavorites() {
    this.$http.put(`/api/users/addAppToUsersFavorites/${this.app._id}`);
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

export default angular.module('hh7App.appStore.appDetails', [])
  .component('appDetails', {
    template: require('./appDetails.html'),
    controller: ['$scope', '$stateParams', '$http', '$state', AppDetailsComponent],
    controllerAs: 'appDetailsCtrl'
  })
  .name;
