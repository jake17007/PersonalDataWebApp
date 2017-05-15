'use strict';

describe('Component: EditOwnedAppComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.editOwnedApp'));

  var EditOwnedAppComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    EditOwnedAppComponent = $componentController('editOwnedApp', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
