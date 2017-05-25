'use strict';

describe('Component: JsonViewComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.jsonView'));

  var JsonViewComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    JsonViewComponent = $componentController('jsonView', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
