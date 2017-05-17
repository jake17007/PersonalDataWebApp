'use strict';

var express = require('express');
var controller = require('./analysis.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.get('/runApp/:appId', auth.isAuthenticated(), controller.runAppTwo);
router.get('/developers/myOwnedApps', auth.isAuthenticated(), controller.getMyOwnedApps);
router.get('/user/myFavoriteApps', auth.isAuthenticated(), controller.getMyFavoriteApps);

module.exports = router;
