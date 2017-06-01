'use strict';
const angular = require('angular');

/*@ngInject*/
export function modalService($rootScope, $uibModal) {
	// AngularJS will instantiate a singleton by calling "new" on this function

  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @param {Boolean} allowClose - should the modal be able to be closed by the user without button click
   * @return {Object}            - the instance $uibModal.open() returns
   */
  function openModal(scope = {}, modalClass = 'modal-default', allowClose=true) {
    var modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);

    var backdrop = true;
    var keyboard = true;
    if (allowClose === false) {
      backdrop = 'static';
      keyboard = false;
    }

    return $uibModal.open({
      backdrop: backdrop,
      keyboard: keyboard,
      template: require('./modal.html'),
      windowClass: modalClass,
      scope: modalScope
    });
  }

  // Public API here
  return {

    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */
      delete(del = angular.noop, theHttp, theState, theAppWithChanges) {
        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var name = args.shift();
          var deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: `<p>Are you sure you want to delete <strong>${name}</strong> ?</p>`,
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          deleteModal.result.then(function(event) {
            //del.apply(event, args);
            del(theHttp, theState, theAppWithChanges)
          });
        };
      },
      /**
       * Create a function to open a success window with a continue button
       * @param  {Function} ok - callback, ran when delete is confirmed
       * @param {Object} theState - the fucking state
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */
      created(ok = angular.noop, theState) {
        /**
         * Open a continue confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to ok callback
         */
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var name = args.shift();
          var submissionAcceptedModal;

          submissionAcceptedModal = openModal({
            modal: {
              backdrop: 'static',
              keyboard: false,
              dismissable: false,
              title: 'App Created',
              html: `<p><strong>${name}</strong> has been created</p>`,
              buttons: [{
                classes: 'btn-success',
                text: 'Continue',
                click(e) {
                  submissionAcceptedModal.close(e);
                }
              }]
            }
          }, 'modal-success', false);

          submissionAcceptedModal.result.then(function(event) {
            //ok.apply(event, args);
            ok(theState);

          });
        };
      },
      /**
       * Create a function to open a success window with a continue button
       * @param  {Function} ok - callback, ran when delete is confirmed
       * @param {Object} theState - the fucking state
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */
      saved(ok = angular.noop, theState) {
        /**
         * Open a continue confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to ok callback
         */
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var name = args.shift();
          var submissionAcceptedModal;

          submissionAcceptedModal = openModal({
            modal: {
              backdrop: 'static',
              keyboard: false,
              dismissable: false,
              title: 'App Saved',
              html: `<p><strong>${name}</strong> has been saved</p>`,
              buttons: [{
                classes: 'btn-primary',
                text: 'Continue',
                click(e) {
                  submissionAcceptedModal.close(e);
                }
              }]
            }
          }, 'modal-info', false);

          submissionAcceptedModal.result.then(function(event) {
            //ok.apply(event, args);
            ok(theState);

          });
        };
      }
    }
  };
}

export default angular.module('hh7App.modal', [])
  .factory('modal', modalService)
  .name;
