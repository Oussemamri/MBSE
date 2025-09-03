import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  shareModel,
  getSharedModels,
  getModelShares,
  removeShare
} from '../controllers/shareController';
import {
  shareModelSchema,
  modelIdParamSchema,
  shareIdParamSchema
} from '../validators/shareValidation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /share - Share a model with another user by email
router.post('/', validate(shareModelSchema), shareModel);

// GET /shared - Get models shared with the current user
router.get('/shared', getSharedModels);

// GET /shares/:modelId - Get all shares for a specific model (owner only)
router.get('/shares/:modelId', getModelShares);

// DELETE /shares/:shareId - Remove a share (owner only)
router.delete('/shares/:shareId', removeShare);

export default router;
