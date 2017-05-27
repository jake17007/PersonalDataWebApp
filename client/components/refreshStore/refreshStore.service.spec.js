'use strict';

describe('Service: refreshStore', function() {
  // load the service's module
  beforeEach(module('hh7App.refreshStore'));

  // instantiate service
  var refreshStore;
  beforeEach(inject(function(_refreshStore_) {
    refreshStore = _refreshStore_;
  }));

  it('should do something', function() {
    expect(!!refreshStore).to.be.true;
  });
});
