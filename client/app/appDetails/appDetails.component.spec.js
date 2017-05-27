'use strict';

describe('Component: AppDetailsTwoComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.appDetails'));

  var AppDetailsTwoComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AppDetailsTwoComponent = $componentController('appDetails', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
