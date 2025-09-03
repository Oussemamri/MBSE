import express from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getModels,
  getModel,
  createModel,
  updateModel,
  deleteModel
} from '../controllers/modelController';

const router = express.Router();

// All model routes require authentication
router.use(authenticate);

// GET /models - Get all models for the authenticated user
router.get('/', getModels);

// POST /models - Create a new model
router.post('/', createModel);

// GET /models/:id - Get a specific model
router.get('/:id', getModel);

// PUT /models/:id - Update a model
router.put('/:id', updateModel);

// DELETE /models/:id - Delete a model
router.delete('/:id', deleteModel);

export default router;
