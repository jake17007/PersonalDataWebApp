'use strict';

describe('Component: ConnectionDocsComponent', function() {
  // load the controller's module
  beforeEach(module('hh7App.connectionDocs'));

  var ConnectionDocsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ConnectionDocsComponent = $componentController('connectionDocs', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
