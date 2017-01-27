'use strict';

describe('Component: DevelopersComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.developers'));

  var DevelopersComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    DevelopersComponent = $componentController('developers', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
