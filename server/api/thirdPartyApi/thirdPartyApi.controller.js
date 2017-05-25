/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/thirdPartyApis              ->  index
 * POST    /api/thirdPartyApis              ->  create
 * GET     /api/thirdPartyApis/:id          ->  show
 * PUT     /api/thirdPartyApis/:id          ->  upsert
 * PATCH   /api/thirdPartyApis/:id          ->  patch
 * DELETE  /api/thirdPartyApis/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import ThirdPartyApi from './thirdPartyApi.model';

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

// Gets a list of ThirdPartyApis
export function index(req, res) {
  return ThirdPartyApi.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ThirdPartyApi from the DB
export function show(req, res) {
  return ThirdPartyApi.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ThirdPartyApi in the DB
export function create(req, res) {
  return ThirdPartyApi.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given ThirdPartyApi in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return ThirdPartyApi.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ThirdPartyApi in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return ThirdPartyApi.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ThirdPartyApi from the DB
export function destroy(req, res) {
  return ThirdPartyApi.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
