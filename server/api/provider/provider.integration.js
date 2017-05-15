'use strict';

var app = require('../..');
import request from 'supertest';

var newProvider;

describe('Provider API:', function() {
  describe('GET /api/providers', function() {
    var providers;

    beforeEach(function(done) {
      request(app)
        .get('/api/providers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          providers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(providers).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/providers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/providers')
        .send({
          name: 'New Provider',
          info: 'This is the brand new provider!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProvider = res.body;
          done();
        });
    });

    it('should respond with the newly created provider', function() {
      expect(newProvider.name).to.equal('New Provider');
      expect(newProvider.info).to.equal('This is the brand new provider!!!');
    });
  });

  describe('GET /api/providers/:id', function() {
    var provider;

    beforeEach(function(done) {
      request(app)
        .get(`/api/providers/${newProvider._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          provider = res.body;
          done();
        });
    });

    afterEach(function() {
      provider = {};
    });

    it('should respond with the requested provider', function() {
      expect(provider.name).to.equal('New Provider');
      expect(provider.info).to.equal('This is the brand new provider!!!');
    });
  });

  describe('PUT /api/providers/:id', function() {
    var updatedProvider;

    beforeEach(function(done) {
      request(app)
        .put(`/api/providers/${newProvider._id}`)
        .send({
          name: 'Updated Provider',
          info: 'This is the updated provider!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProvider = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProvider = {};
    });

    it('should respond with the updated provider', function() {
      expect(updatedProvider.name).to.equal('Updated Provider');
      expect(updatedProvider.info).to.equal('This is the updated provider!!!');
    });

    it('should respond with the updated provider on a subsequent GET', function(done) {
      request(app)
        .get(`/api/providers/${newProvider._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let provider = res.body;

          expect(provider.name).to.equal('Updated Provider');
          expect(provider.info).to.equal('This is the updated provider!!!');

          done();
        });
    });
  });

  describe('PATCH /api/providers/:id', function() {
    var patchedProvider;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/providers/${newProvider._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Provider' },
          { op: 'replace', path: '/info', value: 'This is the patched provider!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProvider = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProvider = {};
    });

    it('should respond with the patched provider', function() {
      expect(patchedProvider.name).to.equal('Patched Provider');
      expect(patchedProvider.info).to.equal('This is the patched provider!!!');
    });
  });

  describe('DELETE /api/providers/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/providers/${newProvider._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when provider does not exist', function(done) {
      request(app)
        .delete(`/api/providers/${newProvider._id}`)
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
