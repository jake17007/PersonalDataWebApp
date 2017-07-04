'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var scopeCtrlStub = {
  index: 'scopeCtrl.index',
  show: 'scopeCtrl.show',
  create: 'scopeCtrl.create',
  upsert: 'scopeCtrl.upsert',
  patch: 'scopeCtrl.patch',
  destroy: 'scopeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var scopeIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './scope.controller': scopeCtrlStub
});

describe('Scope API Router:', function() {
  it('should return an express router instance', function() {
    expect(scopeIndex).to.equal(routerStub);
  });

  describe('GET /api/scopes', function() {
    it('should route to scope.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'scopeCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/scopes/:id', function() {
    it('should route to scope.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'scopeCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/scopes', function() {
    it('should route to scope.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'scopeCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/scopes/:id', function() {
    it('should route to scope.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'scopeCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/scopes/:id', function() {
    it('should route to scope.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'scopeCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/scopes/:id', function() {
    it('should route to scope.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'scopeCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
