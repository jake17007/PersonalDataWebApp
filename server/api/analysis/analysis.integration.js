'use strict';

var app = require('../..');
import request from 'supertest';

var newAnalysis;

describe('Analysis API:', function() {
  describe('GET /api/analyses', function() {
    var analysiss;

    beforeEach(function(done) {
      request(app)
        .get('/api/analyses')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          analysiss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(analysiss).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/analyses', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/analyses')
        .send({
          name: 'New Analysis',
          info: 'This is the brand new analysis!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newAnalysis = res.body;
          done();
        });
    });

    it('should respond with the newly created analysis', function() {
      expect(newAnalysis.name).to.equal('New Analysis');
      expect(newAnalysis.info).to.equal('This is the brand new analysis!!!');
    });
  });

  describe('GET /api/analyses/:id', function() {
    var analysis;

    beforeEach(function(done) {
      request(app)
        .get(`/api/analyses/${newAnalysis._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          analysis = res.body;
          done();
        });
    });

    afterEach(function() {
      analysis = {};
    });

    it('should respond with the requested analysis', function() {
      expect(analysis.name).to.equal('New Analysis');
      expect(analysis.info).to.equal('This is the brand new analysis!!!');
    });
  });

  describe('PUT /api/analyses/:id', function() {
    var updatedAnalysis;

    beforeEach(function(done) {
      request(app)
        .put(`/api/analyses/${newAnalysis._id}`)
        .send({
          name: 'Updated Analysis',
          info: 'This is the updated analysis!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedAnalysis = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAnalysis = {};
    });

    it('should respond with the updated analysis', function() {
      expect(updatedAnalysis.name).to.equal('Updated Analysis');
      expect(updatedAnalysis.info).to.equal('This is the updated analysis!!!');
    });

    it('should respond with the updated analysis on a subsequent GET', function(done) {
      request(app)
        .get(`/api/analyses/${newAnalysis._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let analysis = res.body;

          expect(analysis.name).to.equal('Updated Analysis');
          expect(analysis.info).to.equal('This is the updated analysis!!!');

          done();
        });
    });
  });

  describe('PATCH /api/analyses/:id', function() {
    var patchedAnalysis;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/analyses/${newAnalysis._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Analysis' },
          { op: 'replace', path: '/info', value: 'This is the patched analysis!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedAnalysis = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedAnalysis = {};
    });

    it('should respond with the patched analysis', function() {
      expect(patchedAnalysis.name).to.equal('Patched Analysis');
      expect(patchedAnalysis.info).to.equal('This is the patched analysis!!!');
    });
  });

  describe('DELETE /api/analyses/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/analyses/${newAnalysis._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when analysis does not exist', function(done) {
      request(app)
        .delete(`/api/analyses/${newAnalysis._id}`)
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
