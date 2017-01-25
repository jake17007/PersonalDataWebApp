'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var analysisCtrlStub = {
  index: 'analysisCtrl.index',
  show: 'analysisCtrl.show',
  create: 'analysisCtrl.create',
  upsert: 'analysisCtrl.upsert',
  patch: 'analysisCtrl.patch',
  destroy: 'analysisCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var analysisIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './analysis.controller': analysisCtrlStub
});

describe('Analysis API Router:', function() {
  it('should return an express router instance', function() {
    expect(analysisIndex).to.equal(routerStub);
  });

  describe('GET /api/analyses', function() {
    it('should route to analysis.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'analysisCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/analyses/:id', function() {
    it('should route to analysis.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'analysisCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/analyses', function() {
    it('should route to analysis.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'analysisCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/analyses/:id', function() {
    it('should route to analysis.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'analysisCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/analyses/:id', function() {
    it('should route to analysis.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'analysisCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/analyses/:id', function() {
    it('should route to analysis.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'analysisCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
