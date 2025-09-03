import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  createDiagram,
  getModelDiagrams,
  getDiagramDetails,
  updateDiagram,
  deleteDiagram,
  addBlockToDiagram,
  removeBlockFromDiagram
} from '../controllers/diagramController';

const router = Router();

// All diagram routes require authentication
router.use(authenticate);

// Diagram CRUD
router.post('/', createDiagram);                              // POST /api/diagrams
router.get('/:modelId', getModelDiagrams);                    // GET /api/diagrams/:modelId
router.get('/detail/:id', getDiagramDetails);                 // GET /api/diagrams/detail/:id
router.put('/:id', updateDiagram);                           // PUT /api/diagrams/:id
router.delete('/:id', deleteDiagram);                        // DELETE /api/diagrams/:id

// Diagram block management
router.post('/:diagramId/blocks/:blockId', addBlockToDiagram);     // POST /api/diagrams/:diagramId/blocks/:blockId
router.delete('/:diagramId/blocks/:blockId', removeBlockFromDiagram); // DELETE /api/diagrams/:diagramId/blocks/:blockId

export default router;
