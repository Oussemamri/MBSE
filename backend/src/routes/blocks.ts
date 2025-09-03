import express from 'express';
import { authenticate } from '../middlewares/auth';
import { validate, schemas } from '../middlewares/validation';
import {
  createBlock,
  updateBlock,
  getModelBlocks,
  deleteBlock
} from '../controllers/blockController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /blocks/:modelId - Get all blocks for a model
router.get('/:modelId', getModelBlocks);

// POST /blocks - Create a new block
router.post('/', validate(schemas.block), createBlock);

// PUT /blocks/:id - Update a block
router.put('/:id', validate(schemas.blockUpdate), updateBlock);

// DELETE /blocks/:id - Delete a block
router.delete('/:id', deleteBlock);

export default router;
