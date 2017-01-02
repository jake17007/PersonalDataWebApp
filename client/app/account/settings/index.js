'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('hh7App.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
