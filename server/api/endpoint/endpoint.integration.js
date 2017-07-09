'use strict';

var app = require('../..');
import request from 'supertest';

var newEndpoint;

describe('Endpoint API:', function() {
  describe('GET /api/endpoints', function() {
    var endpoints;

    beforeEach(function(done) {
      request(app)
        .get('/api/endpoints')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          endpoints = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(endpoints).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/endpoints', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/endpoints')
        .send({
          name: 'New Endpoint',
          info: 'This is the brand new endpoint!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newEndpoint = res.body;
          done();
        });
    });

    it('should respond with the newly created endpoint', function() {
      expect(newEndpoint.name).to.equal('New Endpoint');
      expect(newEndpoint.info).to.equal('This is the brand new endpoint!!!');
    });
  });

  describe('GET /api/endpoints/:id', function() {
    var endpoint;

    beforeEach(function(done) {
      request(app)
        .get(`/api/endpoints/${newEndpoint._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          endpoint = res.body;
          done();
        });
    });

    afterEach(function() {
      endpoint = {};
    });

    it('should respond with the requested endpoint', function() {
      expect(endpoint.name).to.equal('New Endpoint');
      expect(endpoint.info).to.equal('This is the brand new endpoint!!!');
    });
  });

  describe('PUT /api/endpoints/:id', function() {
    var updatedEndpoint;

    beforeEach(function(done) {
      request(app)
        .put(`/api/endpoints/${newEndpoint._id}`)
        .send({
          name: 'Updated Endpoint',
          info: 'This is the updated endpoint!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedEndpoint = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEndpoint = {};
    });

    it('should respond with the updated endpoint', function() {
      expect(updatedEndpoint.name).to.equal('Updated Endpoint');
      expect(updatedEndpoint.info).to.equal('This is the updated endpoint!!!');
    });

    it('should respond with the updated endpoint on a subsequent GET', function(done) {
      request(app)
        .get(`/api/endpoints/${newEndpoint._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let endpoint = res.body;

          expect(endpoint.name).to.equal('Updated Endpoint');
          expect(endpoint.info).to.equal('This is the updated endpoint!!!');

          done();
        });
    });
  });

  describe('PATCH /api/endpoints/:id', function() {
    var patchedEndpoint;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/endpoints/${newEndpoint._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Endpoint' },
          { op: 'replace', path: '/info', value: 'This is the patched endpoint!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedEndpoint = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedEndpoint = {};
    });

    it('should respond with the patched endpoint', function() {
      expect(patchedEndpoint.name).to.equal('Patched Endpoint');
      expect(patchedEndpoint.info).to.equal('This is the patched endpoint!!!');
    });
  });

  describe('DELETE /api/endpoints/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/endpoints/${newEndpoint._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when endpoint does not exist', function(done) {
      request(app)
        .delete(`/api/endpoints/${newEndpoint._id}`)
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
