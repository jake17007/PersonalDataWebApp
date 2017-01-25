'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var thirdPartySpecCtrlStub = {
  index: 'thirdPartySpecCtrl.index',
  show: 'thirdPartySpecCtrl.show',
  create: 'thirdPartySpecCtrl.create',
  upsert: 'thirdPartySpecCtrl.upsert',
  patch: 'thirdPartySpecCtrl.patch',
  destroy: 'thirdPartySpecCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var thirdPartySpecIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './thirdPartySpec.controller': thirdPartySpecCtrlStub
});

describe('ThirdPartySpec API Router:', function() {
  it('should return an express router instance', function() {
    expect(thirdPartySpecIndex).to.equal(routerStub);
  });

  describe('GET /api/thirdPartySpecs', function() {
    it('should route to thirdPartySpec.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'thirdPartySpecCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/thirdPartySpecs/:id', function() {
    it('should route to thirdPartySpec.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'thirdPartySpecCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/thirdPartySpecs', function() {
    it('should route to thirdPartySpec.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'thirdPartySpecCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/thirdPartySpecs/:id', function() {
    it('should route to thirdPartySpec.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'thirdPartySpecCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/thirdPartySpecs/:id', function() {
    it('should route to thirdPartySpec.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'thirdPartySpecCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/thirdPartySpecs/:id', function() {
    it('should route to thirdPartySpec.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'thirdPartySpecCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
