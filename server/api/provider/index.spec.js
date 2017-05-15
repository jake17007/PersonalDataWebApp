'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var providerCtrlStub = {
  index: 'providerCtrl.index',
  show: 'providerCtrl.show',
  create: 'providerCtrl.create',
  upsert: 'providerCtrl.upsert',
  patch: 'providerCtrl.patch',
  destroy: 'providerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var providerIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './provider.controller': providerCtrlStub
});

describe('Provider API Router:', function() {
  it('should return an express router instance', function() {
    expect(providerIndex).to.equal(routerStub);
  });

  describe('GET /api/providers', function() {
    it('should route to provider.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'providerCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/providers/:id', function() {
    it('should route to provider.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'providerCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/providers', function() {
    it('should route to provider.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'providerCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/providers/:id', function() {
    it('should route to provider.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'providerCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/providers/:id', function() {
    it('should route to provider.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'providerCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/providers/:id', function() {
    it('should route to provider.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'providerCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
