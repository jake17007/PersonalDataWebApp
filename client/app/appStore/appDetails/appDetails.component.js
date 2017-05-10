'use strict';
const angular = require('angular');

export class AppDetailsComponent {

  /*@ngInject*/
  constructor($scope, $stateParams, $http) {
    this.message = 'World';
    this.$scope = $scope;
    this.$http = $http;
    this.appId = $stateParams.appId;
    this.appName = $stateParams.appName;
  }

  addAppToUsersFavorites() {
    console.log('this worked for adding the app');
    console.log('this is appId ' + this.appId);
    this.$http.put(`/api/users/addAppToUsersFavorites/${this.appName}/${this.appId}`);
  }
}

export default angular.module('hh7App.appStore.appDetails', [])
  .component('appDetails', {
    template: require('./appDetails.html'),
    controller: ['$scope', '$stateParams', '$http', AppDetailsComponent],
    controllerAs: 'appDetailsCtrl'
  })
  .name;
