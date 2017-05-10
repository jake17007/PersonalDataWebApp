'use strict';

describe('Component: UserAppViewComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.userAppView'));

  var UserAppViewComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    UserAppViewComponent = $componentController('userAppView', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
