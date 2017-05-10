'use strict';

describe('Component: AppStoreComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.appStore'));

  var AppStoreComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AppStoreComponent = $componentController('appStore', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
