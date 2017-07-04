'use strict';

var app = require('../..');
import request from 'supertest';

var newScope;

describe('Scope API:', function() {
  describe('GET /api/scopes', function() {
    var scopes;

    beforeEach(function(done) {
      request(app)
        .get('/api/scopes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          scopes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(scopes).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/scopes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/scopes')
        .send({
          name: 'New Scope',
          info: 'This is the brand new scope!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newScope = res.body;
          done();
        });
    });

    it('should respond with the newly created scope', function() {
      expect(newScope.name).to.equal('New Scope');
      expect(newScope.info).to.equal('This is the brand new scope!!!');
    });
  });

  describe('GET /api/scopes/:id', function() {
    var scope;

    beforeEach(function(done) {
      request(app)
        .get(`/api/scopes/${newScope._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          scope = res.body;
          done();
        });
    });

    afterEach(function() {
      scope = {};
    });

    it('should respond with the requested scope', function() {
      expect(scope.name).to.equal('New Scope');
      expect(scope.info).to.equal('This is the brand new scope!!!');
    });
  });

  describe('PUT /api/scopes/:id', function() {
    var updatedScope;

    beforeEach(function(done) {
      request(app)
        .put(`/api/scopes/${newScope._id}`)
        .send({
          name: 'Updated Scope',
          info: 'This is the updated scope!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedScope = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedScope = {};
    });

    it('should respond with the updated scope', function() {
      expect(updatedScope.name).to.equal('Updated Scope');
      expect(updatedScope.info).to.equal('This is the updated scope!!!');
    });

    it('should respond with the updated scope on a subsequent GET', function(done) {
      request(app)
        .get(`/api/scopes/${newScope._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let scope = res.body;

          expect(scope.name).to.equal('Updated Scope');
          expect(scope.info).to.equal('This is the updated scope!!!');

          done();
        });
    });
  });

  describe('PATCH /api/scopes/:id', function() {
    var patchedScope;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/scopes/${newScope._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Scope' },
          { op: 'replace', path: '/info', value: 'This is the patched scope!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedScope = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedScope = {};
    });

    it('should respond with the patched scope', function() {
      expect(patchedScope.name).to.equal('Patched Scope');
      expect(patchedScope.info).to.equal('This is the patched scope!!!');
    });
  });

  describe('DELETE /api/scopes/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/scopes/${newScope._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when scope does not exist', function(done) {
      request(app)
        .delete(`/api/scopes/${newScope._id}`)
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
