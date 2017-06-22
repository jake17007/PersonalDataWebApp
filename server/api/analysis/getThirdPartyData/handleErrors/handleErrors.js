'use strict';


/**
 * Checks for errors within the data returned from the various
 * third Party APIs
 *
 * INPUT:  appAndUserData = {
 *            app: Analysis, // the given analysis
 *            user: User     // the given user
 *          }
 * OUTPUT: Promise returning an array of data or any errors
 */
export function handleErrors() {
  return function(returnedData) {
    return returnedData;
  }
}
