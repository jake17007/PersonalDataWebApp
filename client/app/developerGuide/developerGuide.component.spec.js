'use strict';

describe('Component: DeveloperGuideComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.developerGuide'));

  var DeveloperGuideComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    DeveloperGuideComponent = $componentController('developerGuide', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
