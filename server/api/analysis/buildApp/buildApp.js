'use strict';

var Git = require('nodegit');

/**
 * Creates the app program within the local file system to be passed the
 * user's third party api dataGetters
 *
 * INPUT:  appAndUserData = {
              app: Analysis, // the given analysis
              user: User     // the given user
 *          }
 * OUTPUT: Promise returning a string 'build successful' or any errors
 */
export function buildApp(appAndUserData) {
  return new Promise(function(resolve, reject) {
    // Pull the app's source code from Github and save it in 'nodegit'
    Git.Clone(appAndUserData.app.githubLink, 'nodegit')
    .then(repository => {
      console.log('Building the app was successful.');
      resolve('build successful');
    })
    .catch(err => {
      reject(err);
    });
  });
}
