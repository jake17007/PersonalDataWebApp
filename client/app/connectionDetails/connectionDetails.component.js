'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './connectionDetails.routes';

export class ConnectionDetailsComponent {
  /*@ngInject*/
  constructor($stateParams, refreshStore, $http, $window) {
    this.$http = $http;
    this.refreshStore = refreshStore;
    this.window = $window;
    // If this is the first load of the page
    if ($stateParams.user && $stateParams.thirdPartyApi) {
      // Store the user and thirdPartyApi
      this.user = $stateParams.user;
      this.thirdPartyApi = $stateParams.thirdPartyApi;
      // Set the cookie data for possible refresh
      refreshStore.setCookieData({
        user: this.user,
        thirdPartyApiId: this.thirdPartyApi._id
      });
      // Indicate whether the user has this connection established
      if (_.find(this.user.connections, {thirdPartyApi: this.thirdPartyApi._id}))
      this.userConnectionEstablished = true;
      else this.userConnectionEstablished = false;
      // Other wise load from the refreshStore (because apparently it was refreshed)
    } else {
      // Store the user
      this.user = refreshStore.getCookieData().user;
      // Get the thirdPartyApi (since full data too large to store in cookie)
      this.$http.get(`api/thirdPartyApis/${refreshStore.getCookieData().thirdPartyApiId}`)
      .then(res => {
        // Store the thirdPartyApi
        this.thirdPartyApi = res.data;
        // Reset the cookie data for possible refresh
        refreshStore.setCookieData({
          user: this.user,
          thirdPartyApiId: this.thirdPartyApi._id
        });
      })
      .then(() => {
        // Indicate whether the user has this connection established
        if (_.find(this.user.connections, {thirdPartyApi: this.thirdPartyApi._id}))
        this.userConnectionEstablished = true;
        else this.userConnectionEstablished = false;
      })
      .catch(err => {throw err;});
    }
  }


  removeConnection() {
    this.$http.delete(`api/users/connections/${this.thirdPartyApi._id}`)
    .then(() => {
      // Retrive the user again
      this.$http.get('api/users/me')
      .then(res => {
        this.user = res.data;
      })
      .then(() => {
        if (_.find(this.user.connections, {thirdPartyApi: this.thirdPartyApi._id}))
        this.userConnectionEstablished = true;
        else this.userConnectionEstablished = false;
      })
      .then(() => {
        this.refreshStore.setCookieData({
          user: this.user,
          thirdPartyApiId: this.thirdPartyApi._id
        });
      });
    })
    .catch(err => {throw err;});
  }

  connect() {
    this.window.location.href = `/auth/connect/${this.thirdPartyApi.provider}`;
  }

}

export default angular.module('hh7App.connectionDetails', [uiRouter])
  .config(routes)
  .component('connectionDetails', {
    template: require('./connectionDetails.html'),
    controller: ['$stateParams', 'refreshStore', '$http', '$window', ConnectionDetailsComponent],
    controllerAs: 'connectionDetailsCtrl'
  })
  .name;
