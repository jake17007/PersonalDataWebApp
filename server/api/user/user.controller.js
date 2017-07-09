'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 * router.get('/', auth.hasRole('admin'), controller.index);
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 * router.post('/', controller.create);
 */
export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 * router.get('/:id', auth.isAuthenticated(), controller.show);
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 * router.delete('/:id', auth.hasRole('admin'), controller.destroy);
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 * router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Add an app to a user's favorites
 * router.put('/addAppToUsersFavorites/:appId', auth.isAuthenticated(), controller.addAppToUsersFavorites);
 */
export function addAppToUsersFavorites(req, res) {
  var userId = req.user._id;
  var appIdToAdd = req.params.appId;
  console.log('this is the userId: ', userId);
  console.log('this is the appId: ', appIdToAdd);
  return User.findById(userId).exec()
    .then(user => {
      if (user['favoriteApps'].filter(function(appId) {return appId.equals(appIdToAdd);}).length <= 0) {
        user['favoriteApps'].push(appIdToAdd);
      }
      return user.save()
      .then(() => {
        res.status(204).end();
      })
      .catch(validationError(res));
  });
}

/**
 * Add an app to a user's favorites
 * router.put('/addAppToUsersFavorites/:appId', auth.isAuthenticated(), controller.addAppToUsersFavorites);
 */
export function removeAppFromFavorites(req, res) {
  var userId = req.user._id;
  var appIdToRemove = req.params.appId;
  console.log('this is the userId: ', userId);
  console.log('this is the appId: ', appIdToRemove);
  return User.findById(userId).exec()
    .then(user => {
      console.log(user);
      return user;
    })
    .then(user => {
      var favoriteAppsWithoutRemoved = user['favoriteApps'].filter(function(appId) {
        return !appId.equals(appIdToRemove);
      });
      console.log('here is the new array: ', favoriteAppsWithoutRemoved);
      user.favoriteApps = favoriteAppsWithoutRemoved;
      console.log('here is the new user: ', user);
      return user.save()
      .then(() => {
        res.status(204).end();
      })
      .catch(validationError(res));
  });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password')
    .populate('connections')
    .exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Get my info required for My Dashboard
 */
export function myDashboardInfo(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password')
    .populate('connections.thirdPartyApi', 'label')
    .populate('favoriteApps')
    .lean()
    .exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      user.connections = _.map(user.connections, function(connection) {
        return connection.thirdPartyApi;
      });
      console.log(user.connections);
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}

/**
 * Get my connections
 */
export function connections(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    // Get the user
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      return user;
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
}
