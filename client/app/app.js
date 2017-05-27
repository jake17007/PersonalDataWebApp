'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import ngclipboard from 'ngclipboard';
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import DashboardComponent from './dashboard/dashboard.component';
import ConnectComponent from './connect/connect.component';
import DevelopersComponent from './developers/developers.component';
import CreateNewAppComponent from './createNewApp/createNewApp.component';
import AppStoreComponent from './appStore/appStore.component';
import AppDetailsComponent from './appDetails/appDetails.component';
import ConnectionDocsComponent from './connectionDocs/connectionDocs.component';
import UserAppViewComponent from './userAppView/userAppView.component';
import EditOwnedAppComponent from './editOwnedApp/editOwnedApp.component';
import JsonViewComponent from './jsonView/jsonView.component';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import refreshStore from '../components/refreshStore/refreshStore.service';
import modal from '../components/modal/modal.service';


import './app.scss';

angular.module('hh7App', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', uiRouter,
  uiBootstrap, _Auth, account, admin, DashboardComponent, ConnectComponent, DevelopersComponent, CreateNewAppComponent, AppStoreComponent, ConnectionDocsComponent, UserAppViewComponent, EditOwnedAppComponent, JsonViewComponent, AppDetailsComponent, navbar, footer, main, constants, socket, util, ngclipboard, refreshStore, modal
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['hh7App'], {
      strictDi: true
    });
  });
