import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  exportModelJson,
  exportModelXmi,
  importModelJson
} from '../controllers/exportImportController';
import {
  modelIdParamSchema,
  importJsonSchema
} from '../validators/exportImportValidation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /export/json/:modelId - Export model as JSON
router.get('/json/:modelId', exportModelJson);

// GET /export/xmi/:modelId - Export model as SysML XMI
router.get('/xmi/:modelId', exportModelXmi);

// POST /import/json - Import model from JSON
router.post('/json', validate(importJsonSchema), importModelJson);

export default router;
