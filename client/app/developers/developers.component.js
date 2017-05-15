'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './developers.routes';


export class DevelopersComponent {
  myApps;

  /*@ngInject*/
  constructor($http, $state) {
    this.message = 'Hello';
    this.$http = $http;
    this.$state = $state;
  }

  $onInit() {
    this.$http.get('/api/analyses/developers/myOwnedApps')
      .then(response => {
        console.log('this is the response: ', response);
        this.myApps = response.data;
      });
  }

  viewAppDetails(theApp) {
    this.$state.go('appDetails', {app: theApp});
  }
}

export default angular.module('hh7App.developers', [uiRouter])
  .config(routes)
  .component('developers', {
    template: require('./developers.html'),
    controller: DevelopersComponent,
    controllerAs: 'developersCtrl'
  })
  .name;
