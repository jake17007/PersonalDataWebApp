'use strict';

describe('Component: GettingStartedComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.gettingStarted'));

  var GettingStartedComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    GettingStartedComponent = $componentController('gettingStarted', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
