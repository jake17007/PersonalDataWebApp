'use strict';

describe('Component: ConnectComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.connect'));

  var ConnectComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ConnectComponent = $componentController('connect', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
