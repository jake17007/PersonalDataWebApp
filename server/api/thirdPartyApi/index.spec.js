'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var thirdPartyApiCtrlStub = {
  index: 'thirdPartyApiCtrl.index',
  show: 'thirdPartyApiCtrl.show',
  create: 'thirdPartyApiCtrl.create',
  upsert: 'thirdPartyApiCtrl.upsert',
  patch: 'thirdPartyApiCtrl.patch',
  destroy: 'thirdPartyApiCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var thirdPartyApiIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './thirdPartyApi.controller': thirdPartyApiCtrlStub
});

describe('ThirdPartyApi API Router:', function() {
  it('should return an express router instance', function() {
    expect(thirdPartyApiIndex).to.equal(routerStub);
  });

  describe('GET /api/thirdPartyApis', function() {
    it('should route to thirdPartyApi.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'thirdPartyApiCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/thirdPartyApis/:id', function() {
    it('should route to thirdPartyApi.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'thirdPartyApiCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/thirdPartyApis', function() {
    it('should route to thirdPartyApi.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'thirdPartyApiCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/thirdPartyApis/:id', function() {
    it('should route to thirdPartyApi.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'thirdPartyApiCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/thirdPartyApis/:id', function() {
    it('should route to thirdPartyApi.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'thirdPartyApiCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/thirdPartyApis/:id', function() {
    it('should route to thirdPartyApi.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'thirdPartyApiCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
