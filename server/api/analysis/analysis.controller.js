/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/analyses              ->  index
 * POST    /api/analyses              ->  create
 * GET     /api/analyses/:id          ->  show
 * PUT     /api/analyses/:id          ->  upsert
 * PATCH   /api/analyses/:id          ->  patch
 * DELETE  /api/analyses/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Analysis from './analysis.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Analysiss
export function index(req, res) {
  return Analysis.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Analysis from the DB
export function show(req, res) {
  return Analysis.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Analysis in the DB
export function create(req, res) {
  return Analysis.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Analysis in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Analysis.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Analysis in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Analysis.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Analysis from the DB
export function destroy(req, res) {
  return Analysis.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
