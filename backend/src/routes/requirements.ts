import express from 'express';
import { 
  getRequirements, 
  createRequirement, 
  updateRequirement, 
  deleteRequirement,
  getModelRequirements,
  getTraceabilityMatrix,
  linkRequirementToBlocks,
  unlinkRequirementFromBlock
} from '../controllers/requirementController';
import { authenticate } from '../middlewares/auth';
import { validate, schemas } from '../middlewares/validation';

const router = express.Router();

// GET /requirements
router.get('/', authenticate, getRequirements);

// GET /requirements/model/:modelId
router.get('/model/:modelId', authenticate, getModelRequirements);

// GET /requirements/traceability/:modelId
router.get('/traceability/:modelId', authenticate, getTraceabilityMatrix);

// POST /requirements
router.post('/', authenticate, validate(schemas.requirement), createRequirement);

// PUT /requirements/:id
router.put('/:id', authenticate, validate(schemas.requirement), updateRequirement);

// DELETE /requirements/:id
router.delete('/:id', authenticate, deleteRequirement);

// POST /requirements/:id/link - Link requirement to blocks
router.post('/:id/link', authenticate, linkRequirementToBlocks);

// DELETE /requirements/:id/link/:blockId - Unlink requirement from block
router.delete('/:id/link/:blockId', authenticate, unlinkRequirementFromBlock);

export default router;
