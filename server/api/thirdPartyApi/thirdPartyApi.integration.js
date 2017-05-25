'use strict';

var app = require('../..');
import request from 'supertest';

var newThirdPartyApi;

describe('ThirdPartyApi API:', function() {
  describe('GET /api/thirdPartyApis', function() {
    var thirdPartyApis;

    beforeEach(function(done) {
      request(app)
        .get('/api/thirdPartyApis')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          thirdPartyApis = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(thirdPartyApis).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/thirdPartyApis', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/thirdPartyApis')
        .send({
          name: 'New ThirdPartyApi',
          info: 'This is the brand new thirdPartyApi!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newThirdPartyApi = res.body;
          done();
        });
    });

    it('should respond with the newly created thirdPartyApi', function() {
      expect(newThirdPartyApi.name).to.equal('New ThirdPartyApi');
      expect(newThirdPartyApi.info).to.equal('This is the brand new thirdPartyApi!!!');
    });
  });

  describe('GET /api/thirdPartyApis/:id', function() {
    var thirdPartyApi;

    beforeEach(function(done) {
      request(app)
        .get(`/api/thirdPartyApis/${newThirdPartyApi._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          thirdPartyApi = res.body;
          done();
        });
    });

    afterEach(function() {
      thirdPartyApi = {};
    });

    it('should respond with the requested thirdPartyApi', function() {
      expect(thirdPartyApi.name).to.equal('New ThirdPartyApi');
      expect(thirdPartyApi.info).to.equal('This is the brand new thirdPartyApi!!!');
    });
  });

  describe('PUT /api/thirdPartyApis/:id', function() {
    var updatedThirdPartyApi;

    beforeEach(function(done) {
      request(app)
        .put(`/api/thirdPartyApis/${newThirdPartyApi._id}`)
        .send({
          name: 'Updated ThirdPartyApi',
          info: 'This is the updated thirdPartyApi!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedThirdPartyApi = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedThirdPartyApi = {};
    });

    it('should respond with the updated thirdPartyApi', function() {
      expect(updatedThirdPartyApi.name).to.equal('Updated ThirdPartyApi');
      expect(updatedThirdPartyApi.info).to.equal('This is the updated thirdPartyApi!!!');
    });

    it('should respond with the updated thirdPartyApi on a subsequent GET', function(done) {
      request(app)
        .get(`/api/thirdPartyApis/${newThirdPartyApi._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let thirdPartyApi = res.body;

          expect(thirdPartyApi.name).to.equal('Updated ThirdPartyApi');
          expect(thirdPartyApi.info).to.equal('This is the updated thirdPartyApi!!!');

          done();
        });
    });
  });

  describe('PATCH /api/thirdPartyApis/:id', function() {
    var patchedThirdPartyApi;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/thirdPartyApis/${newThirdPartyApi._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ThirdPartyApi' },
          { op: 'replace', path: '/info', value: 'This is the patched thirdPartyApi!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedThirdPartyApi = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedThirdPartyApi = {};
    });

    it('should respond with the patched thirdPartyApi', function() {
      expect(patchedThirdPartyApi.name).to.equal('Patched ThirdPartyApi');
      expect(patchedThirdPartyApi.info).to.equal('This is the patched thirdPartyApi!!!');
    });
  });

  describe('DELETE /api/thirdPartyApis/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/thirdPartyApis/${newThirdPartyApi._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when thirdPartyApi does not exist', function(done) {
      request(app)
        .delete(`/api/thirdPartyApis/${newThirdPartyApi._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
