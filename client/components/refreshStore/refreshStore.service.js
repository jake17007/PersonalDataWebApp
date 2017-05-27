'use strict';
const angular = require('angular');
import ngCookies from 'angular-cookies';

/*@ngInject*/
export function refreshStoreService($cookies) {
	// AngularJS will instantiate a singleton by calling "new" on this function

  var data;

  return {
    setCookieData: function(dataToBePersisted) {
      data = dataToBePersisted;
      $cookies.putObject('refreshStoreData', dataToBePersisted);
    },
    getCookieData: function() {
      data = $cookies.getObject('refreshStoreData');
      return data;
    },
    clearCookieData: function() {
      data = null;
      $cookies.remove('refreshStoreData');
    }
  }

}

export default angular.module('hh7App.refreshStore', [ngCookies])
  .factory('refreshStore', refreshStoreService)
  .name;
