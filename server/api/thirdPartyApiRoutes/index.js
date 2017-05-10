'use strict';

var express = require('express');
var controller = require('./thirdPartyApi.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/:id', auth.isAuthenticated(), controller.runApp)

module.exports = router;
