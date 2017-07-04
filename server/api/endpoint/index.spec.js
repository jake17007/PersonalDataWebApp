'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var endpointCtrlStub = {
  index: 'endpointCtrl.index',
  show: 'endpointCtrl.show',
  create: 'endpointCtrl.create',
  upsert: 'endpointCtrl.upsert',
  patch: 'endpointCtrl.patch',
  destroy: 'endpointCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var endpointIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './endpoint.controller': endpointCtrlStub
});

describe('Endpoint API Router:', function() {
  it('should return an express router instance', function() {
    expect(endpointIndex).to.equal(routerStub);
  });

  describe('GET /api/endpoints', function() {
    it('should route to endpoint.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'endpointCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/endpoints/:id', function() {
    it('should route to endpoint.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'endpointCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/endpoints', function() {
    it('should route to endpoint.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'endpointCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/endpoints/:id', function() {
    it('should route to endpoint.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'endpointCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/endpoints/:id', function() {
    it('should route to endpoint.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'endpointCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/endpoints/:id', function() {
    it('should route to endpoint.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'endpointCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
