'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.put('/addAppToUsersFavorites/:appId', auth.isAuthenticated(), controller.addAppToUsersFavorites);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/removeAppFromFavorites/:appId', auth.isAuthenticated(), controller.removeAppFromFavorites);
router.get('/connections', auth.isAuthenticated(), controller.connections);
router.get('/get/myDashboardInfo', auth.isAuthenticated(), controller.myDashboardInfo);
router.post('/humanApiConnect/finish', auth.isAuthenticated(), controller.humanApiConnectFinish);

module.exports = router;
