'use strict';
import config from '../../config/environment';
//import jwt from 'jsonwebtoken';
//import expressJwt from 'express-jwt';
//import compose from 'composable-middleware';
import User from '../../api/user/user.model';
import ThirdPartyApi from '../../api/thirdPartyApi/thirdPartyApi.model';
import _ from 'lodash';

/*
// Returns the updated user
export function upsertConnection(provider, userId, accessToken, refreshToken, providerUserId, callback){
  var oldConnectionId;
  // Look for an old connection
  User.findOne(
    {'_id': userId, 'connections.thirdPartyApi.provider': },
    {'connections.$': 1},
    function(err, user) {
      if (err) {
        return err;
      }
      if (!user) {
        User.findOne(
          {'_id': userId},
          function(err, user) {
            if (err) {
              return err;
            }
            var newConnection = {
              provider: provider,
              accessToken: accessToken,
              refreshToken: refreshToken,
              providerUserId: providerUserId
            };
            user.connections.push(newConnection);
            // Save the user
            user.save(function(err, user) {
              if (err) {
                callback(err);
              }
              callback(null, user);
            });
          }
        )
      } else {
        // Grab the old connection id
        oldConnectionId = user.connections[0]._id;
        // Gab the whole user
        User.findOne(
          {'_id': userId},
          function(err, user) {
            if (err) {
              return error;
            }
            // Remove the old connection
            user.connections.id(oldConnectionId).remove();
            // Save the user
            user.save(function(err, user){
              if (err) {
                return err;
              }
              User.findOne(
                {'_id': userId},
                function(err, user) {
                  var newConnection = {
                    provider: provider,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    providerUserId: providerUserId
                  };
                  user.connections.push(newConnection);
                  // Save the user
                  user.save(function(err, user) {
                    if (err) {
                      callback(err);
                    }
                    callback(null, user);
                  });
                }
              )
            });
          }
        )
      }
    }
  )
}
*/
// Returns the updated user
export function upsertConnection(provider, userId, accessToken, refreshToken, providerUserId, callback){
  console.log('this ran');
  Promise.all([
    ThirdPartyApi.findOne({'provider': provider}).exec(),
    User.findById(userId).exec()
  ])
  .then(result => {
    if (!result[0]) throw('No matching thirdPartyApi found for provider: ', provider);
    if (!result[1]) throw('No matching user found for userId: ', userId);
    return result;
  })
  .then(result => {
    var thirdPartyApi = result[0];
    var user = result[1];
    console.log('before edit');
    console.log(JSON.stringify(user, null, 2));
    var newConnection = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      providerUserId: providerUserId,
      availableScopes: [],
      thirdPartyApi: thirdPartyApi._id
    }
    var oldConnection = _.find(user.connections, {thirdPartyApi: thirdPartyApi._id})
    if (oldConnection) {
      var oldConnectionId = oldConnection._id;
      user.connections.id(oldConnectionId).remove();
    }
    //_.remove(user.connections, {thirdPartyApi: thirdPartyApi._id});
    console.log('after removal');
    console.log(JSON.stringify(user, null, 2));
    user.connections.push(newConnection);
    console.log('after push');
    console.log(JSON.stringify(user, null, 2));
    user.save()
      .then(savedUser => callback(null, savedUser))
      .catch(err => callback(err));
      /*
    user.save(function(err, newUser) {
      if (err) throw(err);
      console.log('after save');
      console.log(JSON.stringify(newUser, null, 2));
      callback(null, newUser);
    });
    */
  })
  .catch(err => {
    console.log('There was an error in upserting the connection: ', err);
    callback(err);
  });
}
