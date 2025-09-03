import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  createLink,
  getModelLinks,
  deleteLink,
  getBlockLinks
} from '../controllers/linkController';
import {
  createLinkSchema,
  modelIdSchema,
  blockLinksSchema
} from '../validators/linkValidation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /links - Create a new link between a block and requirement
router.post('/', validate(createLinkSchema), createLink);

// GET /links/:modelId - Get all links for a specific model
router.get('/:modelId', getModelLinks);

// GET /links/block/:modelId/:blockId - Get all links for a specific block
router.get('/block/:modelId/:blockId', getBlockLinks);

// DELETE /links/:linkId - Delete a specific link
router.delete('/:linkId', deleteLink);

export default router;
