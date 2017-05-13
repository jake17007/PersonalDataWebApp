'use strict';
const angular = require('angular');

export class AppDetailsComponent {

  requirements = [];

  /*@ngInject*/
  constructor($scope, $stateParams, $http) {
    this.message = 'World';
    this.$scope = $scope;
    this.$http = $http;
    this.app = $stateParams.app;
  }

  $onInit() {
    // Populate this.requirements with names of the third party api's required for this app
    this.app.thirdPartyApiRequirements.forEach(requirement => {
      if (requirement.required === true) {
        console.log(requirement)
        this.requirements.push(requirement.label);
      }
    });
    console.log(this.requirements);
  }

  addAppToUsersFavorites() {
    this.$http.put(`/api/users/addAppToUsersFavorites/${this.app.name}/${this.app._id}`);
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
    controller: ['$scope', '$stateParams', '$http', AppDetailsComponent],
    controllerAs: 'appDetailsCtrl'
  })
  .name;
