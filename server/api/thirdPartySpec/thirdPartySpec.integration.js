'use strict';

var app = require('../..');
import request from 'supertest';

var newThirdPartySpec;

describe('ThirdPartySpec API:', function() {
  describe('GET /api/thirdPartySpecs', function() {
    var thirdPartySpecs;

    beforeEach(function(done) {
      request(app)
        .get('/api/thirdPartySpecs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          thirdPartySpecs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(thirdPartySpecs).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/thirdPartySpecs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/thirdPartySpecs')
        .send({
          name: 'New ThirdPartySpec',
          info: 'This is the brand new thirdPartySpec!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newThirdPartySpec = res.body;
          done();
        });
    });

    it('should respond with the newly created thirdPartySpec', function() {
      expect(newThirdPartySpec.name).to.equal('New ThirdPartySpec');
      expect(newThirdPartySpec.info).to.equal('This is the brand new thirdPartySpec!!!');
    });
  });

  describe('GET /api/thirdPartySpecs/:id', function() {
    var thirdPartySpec;

    beforeEach(function(done) {
      request(app)
        .get(`/api/thirdPartySpecs/${newThirdPartySpec._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          thirdPartySpec = res.body;
          done();
        });
    });

    afterEach(function() {
      thirdPartySpec = {};
    });

    it('should respond with the requested thirdPartySpec', function() {
      expect(thirdPartySpec.name).to.equal('New ThirdPartySpec');
      expect(thirdPartySpec.info).to.equal('This is the brand new thirdPartySpec!!!');
    });
  });

  describe('PUT /api/thirdPartySpecs/:id', function() {
    var updatedThirdPartySpec;

    beforeEach(function(done) {
      request(app)
        .put(`/api/thirdPartySpecs/${newThirdPartySpec._id}`)
        .send({
          name: 'Updated ThirdPartySpec',
          info: 'This is the updated thirdPartySpec!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedThirdPartySpec = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedThirdPartySpec = {};
    });

    it('should respond with the updated thirdPartySpec', function() {
      expect(updatedThirdPartySpec.name).to.equal('Updated ThirdPartySpec');
      expect(updatedThirdPartySpec.info).to.equal('This is the updated thirdPartySpec!!!');
    });

    it('should respond with the updated thirdPartySpec on a subsequent GET', function(done) {
      request(app)
        .get(`/api/thirdPartySpecs/${newThirdPartySpec._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let thirdPartySpec = res.body;

          expect(thirdPartySpec.name).to.equal('Updated ThirdPartySpec');
          expect(thirdPartySpec.info).to.equal('This is the updated thirdPartySpec!!!');

          done();
        });
    });
  });

  describe('PATCH /api/thirdPartySpecs/:id', function() {
    var patchedThirdPartySpec;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/thirdPartySpecs/${newThirdPartySpec._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ThirdPartySpec' },
          { op: 'replace', path: '/info', value: 'This is the patched thirdPartySpec!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedThirdPartySpec = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedThirdPartySpec = {};
    });

    it('should respond with the patched thirdPartySpec', function() {
      expect(patchedThirdPartySpec.name).to.equal('Patched ThirdPartySpec');
      expect(patchedThirdPartySpec.info).to.equal('This is the patched thirdPartySpec!!!');
    });
  });

  describe('DELETE /api/thirdPartySpecs/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/thirdPartySpecs/${newThirdPartySpec._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when thirdPartySpec does not exist', function(done) {
      request(app)
        .delete(`/api/thirdPartySpecs/${newThirdPartySpec._id}`)
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
