'use strict';

import angular from 'angular';
import LoginController from './login.controller';

export default angular.module('hh7App.login', [])
  .controller('LoginController', LoginController)
  .name;
