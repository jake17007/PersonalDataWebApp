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
export function buildApp(newNodegitDirName, appAndUserData) {
  return new Promise(function(resolve, reject) {
    // Pull the app's source code from Github and save it newNodegitDirName
    Git.Clone(appAndUserData.app.githubLink, newNodegitDirName)
    .then(() => {
      resolve('Build Successful');
    })
    .catch(reject)
  });
}
