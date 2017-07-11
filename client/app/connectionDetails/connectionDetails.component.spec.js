'use strict';

describe('Component: ConnectionDetailsComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.connectionDetails'));

  var ConnectionDetailsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ConnectionDetailsComponent = $componentController('connectionDetails', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
