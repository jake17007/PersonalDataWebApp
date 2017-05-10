'use strict';

describe('Component: appDetails', function() {
  // load the component's module
  beforeEach(module('hh7App.appStore.appDetails'));

  var appDetailsComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    appDetailsComponent = $componentController('appDetails', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
