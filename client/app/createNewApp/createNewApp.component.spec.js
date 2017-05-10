'use strict';

describe('Component: CreateNewAppComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.createNewApp'));

  var CreateNewAppComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CreateNewAppComponent = $componentController('createNewApp', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
