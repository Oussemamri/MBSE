import express from 'express';
import { getModels, getModel, createModel, updateModel, deleteModel } from '../controllers/modelController';
import { authenticate } from '../middlewares/auth';
import { validate, schemas } from '../middlewares/validation';

const router = express.Router();

// GET /models
router.get('/', authenticate, getModels);

// GET /models/:id
router.get('/:id', authenticate, getModel);

// POST /models
router.post('/', authenticate, validate(schemas.model), createModel);

// PUT /models/:id
router.put('/:id', authenticate, validate(schemas.model), updateModel);

// DELETE /models/:id
router.delete('/:id', authenticate, deleteModel);

export default router;
