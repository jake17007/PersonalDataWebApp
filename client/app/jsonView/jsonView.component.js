'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './jsonView.routes';

export class JsonViewComponent {
  json = null;

  /*@ngInject*/
  constructor($http, $stateParams) {
    this.message = 'Hello';
    this.$http = $http;
    this.app = $stateParams.app;
  }

  $onInit() {
    console.log('heres the app: ', this.app);
    this.$http.post('api/analyses/viewJson', this.app)
    .then(res => {
      this.json = JSON.stringify(res.data, null, 2)
    })
    .catch(err => {
      console.log(err);
    });
  }
}

export default angular.module('hh7App.jsonView', [uiRouter])
  .config(routes)
  .component('jsonView', {
    template: require('./jsonView.html'),
    controller: JsonViewComponent,
    controllerAs: 'jsonViewCtrl'
  })
  .name;
