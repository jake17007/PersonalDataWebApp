'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './connect.routes';

export class ConnectComponent {
  /*@ngInject*/
  constructor(Auth, $window, $http) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.window = $window;
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/thirdPartyApis')
    .then(thirdPartyApis => {
      this.thirdPartyApis = thirdPartyApis.data;
      // Excluding Withings until it gets fixed
      this.thirdPartyApis = _.pull(this.thirdPartyApis, _.find(this.thirdPartyApis, {_id: '5964fa44f179593a0fd7f441'}));
    })
    .catch(err => {
      throw(err);
    });

    this.$http.get('/api/users/me')
    .then(user => {
      this.user = user.data;
      console.log(JSON.stringify(this.user.humanApiConnection.publicToken, null, 2));
    })
    .catch(err => {
      throw(err);
    })
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

  openHumanApiConnect() {
    var options = {
      clientUserId: encodeURIComponent(this.user._id),
      clientId: 'be38f98e5a9a6a459cca12fb260618a07b4d81a5',
      publicToken: this.user.humanApiConnection.publicToken || '',
      finish: function(err, sessionTokenObject) {
        /* Called after user finishes connecting their health data */
        //POST sessionTokenObject as-is to your server for step 2.
        console.log('sessionTokenObject: ', JSON.stringify(sessionTokenObject, null, 2));
        console.log('user id: ', this.user._id);
        $.post('/api/users/humanApiConnect/finish', sessionTokenObject, function(res) {
          console.log('done');
          console.log('res: ', res);
        });
        /*
        this.$http.post('/api/users/humanApiConnect/finish', sessionTokenObject)
        .then(res => {
          console.log('this was called')
          console.log('res: ', res);
        })
        .catch(err => {
          throw(err);
        });
        */

        // Include code here to refresh the page.
      },
      close: function() {
          /* (optional) Called when a user closes the popup
             without connecting any data sources */
      },
      error: function(err) {
          /* (optional) Called if an error occurs when loading
             the popup. */
             console.log(err);
      }
    }
    //console.log(options.finish);
    //console.log(JSON.stringify(options, null, 2));
    HumanConnect.open(options);
  }

  testHumanApiConnect() {
    this.$http.post('/api/users/humanApiConnect/finish', {name: 'test object'}, function(res){
      console.log('done');
    });
      /*
    this.$http.post('api/users/humanApiConnect/finish', {name: 'test object'})
    .then(res => {
      console.log('res: ', res);
    })
    .catch(err => {
      throw(err);
    });
    */
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
