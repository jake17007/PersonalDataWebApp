'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './connect.routes';

export class ConnectComponent {
  /*@ngInject*/
  constructor(Auth, $window, $http, $state) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.window = $window;
    this.$http = $http;
    this.$state = $state;
  }

  $onInit() {

    // Get available thirdPartyApis and store
    this.$http.get('/api/thirdPartyApis')
    .then(res => {
      this.thirdPartyApis = res.data;
      // Excluding Withings until it gets fixed
      this.thirdPartyApis = _.pull(this.thirdPartyApis, _.find(this.thirdPartyApis, {_id: '5964fa44f179593a0fd7f441'}));
    })
    // Get user and store
    .then(() => {
      return this.$http.get('/api/users/me');
    })
    .then(res => {
      this.user = res.data;
    })
    // Indicate which connections user has established
    .then(() => {
      this.thirdPartyApis.forEach(api => {
        if (_.find(this.user.connections, {thirdPartyApi: api._id}))
        api.userConnectionEstablished = true;
        else api.userConnectionEstablished = false;
      });
    })
    .catch(err => {
      throw(err);
    });


  }

  connectAcct(provider) {
    this.window.location.href = `/auth/connect/${provider}`;
  }

  postSessionTokenObject() {

    console.log('this was called');

    var sessionTokenObject = {
      clientId: "be38f98e5a9a6a459cca12fb260618a07b4d81a5",
      humanId: "730bb296134a0085f64dba764f8b6cc7",
      userId: "5963ce2299c848010030b27f",
      sessionToken: "f5e2051c6205942bfb9f3158b512096d"
    }

    this.$http.post('/api/users/humanApiConnect/finish', sessionTokenObject)
    .then(res => {
      console.log('this was called')
      console.log('res: ', res);
    })
    .catch(err => {
      throw(err);
    });
  }

  viewConnectionDetails(thirdPartyApi) {
    this.$state.go('connectionDetails', {
      user: this.user,
      thirdPartyApi: thirdPartyApi
    });
  }

}

export default angular.module('hh7App.connect', [uiRouter])
  .config(routes)
  .component('connect', {
    template: require('./connect.html'),
    controller: ConnectComponent,
    controllerAs: 'connectCtrl'
  })
  .name;
