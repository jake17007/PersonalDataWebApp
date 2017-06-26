'use strict';
import config from '../../config/environment';
//import jwt from 'jsonwebtoken';
//import expressJwt from 'express-jwt';
//import compose from 'composable-middleware';
import User from '../../api/user/user.model';

// Returns the updated user
export function upsertConnection(provider, userId, accessToken, refreshToken, providerUserId, callback){
  var oldConnectionId;
  // Look for an old connection
  User.findOne(
    {'_id': userId, 'connections.provider': provider},
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
