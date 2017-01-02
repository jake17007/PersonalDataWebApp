'use strict';

import angular from 'angular';

export default angular.module('hh7App.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
