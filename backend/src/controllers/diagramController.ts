import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

// Validation schemas
const createDiagramSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['BDD', 'IBD']),
  modelId: z.string().cuid()
});

const updateDiagramSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  type: z.enum(['BDD', 'IBD']).optional()
});

// Create new diagram
export const createDiagram = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, modelId } = createDiagramSchema.parse(req.body);

    // Check if user has access to the model
    const model = await prisma.model.findFirst({
      where: {
        id: modelId,
        OR: [
          { userId: req.user!.id },
          { shares: { some: { userId: req.user!.id } } }
        ]
      }
    });

    if (!model) {
      return res.status(404).json({ error: 'Model not found or access denied' });
    }

    const diagram = await prisma.diagram.create({
      data: {
        name,
        type: type as 'BDD' | 'IBD',
        modelId
      },
      include: {
        diagramBlocks: {
          include: {
            block: true
          }
        }
      }
    });

    res.status(201).json(diagram);
  } catch (error: any) {
    console.error('Create diagram error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to create diagram' });
  }
};

// Get diagrams for a model
export const getModelDiagrams = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId } = req.params;

    // Check if user has access to the model
    const model = await prisma.model.findFirst({
      where: {
        id: modelId,
        OR: [
          { userId: req.user!.id },
          { shares: { some: { userId: req.user!.id } } }
        ]
      }
    });

    if (!model) {
      return res.status(404).json({ error: 'Model not found or access denied' });
    }

    const diagrams = await prisma.diagram.findMany({
      where: { modelId },
      include: {
        diagramBlocks: {
          include: {
            block: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(diagrams);
  } catch (error: any) {
    console.error('Get model diagrams error:', error);
    res.status(500).json({ error: 'Failed to fetch diagrams' });
  }
};

// Get diagram details
export const getDiagramDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const diagram = await prisma.diagram.findFirst({
      where: {
        id,
        model: {
          OR: [
            { userId: req.user!.id },
            { shares: { some: { userId: req.user!.id } } }
          ]
        }
      },
      include: {
        model: true,
        diagramBlocks: {
          include: {
            block: {
              include: {
                parent: true,
                children: true
              }
            }
          }
        }
      }
    });

    if (!diagram) {
      return res.status(404).json({ error: 'Diagram not found or access denied' });
    }

    res.json(diagram);
  } catch (error: any) {
    console.error('Get diagram details error:', error);
    res.status(500).json({ error: 'Failed to fetch diagram details' });
  }
};

// Update diagram
export const updateDiagram = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateDiagramSchema.parse(req.body);

    // Check if user has access to the diagram
    const existingDiagram = await prisma.diagram.findFirst({
      where: {
        id,
        model: {
          OR: [
            { userId: req.user!.id },
            { shares: { some: { userId: req.user!.id, permission: 'edit' } } }
          ]
        }
      }
    });

    if (!existingDiagram) {
      return res.status(404).json({ error: 'Diagram not found or access denied' });
    }

    const diagram = await prisma.diagram.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        diagramBlocks: {
          include: {
            block: true
          }
        }
      }
    });

    res.json(diagram);
  } catch (error: any) {
    console.error('Update diagram error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to update diagram' });
  }
};

// Delete diagram
export const deleteDiagram = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user has access to the diagram
    const existingDiagram = await prisma.diagram.findFirst({
      where: {
        id,
        model: {
          OR: [
            { userId: req.user!.id },
            { shares: { some: { userId: req.user!.id, permission: 'edit' } } }
          ]
        }
      }
    });

    if (!existingDiagram) {
      return res.status(404).json({ error: 'Diagram not found or access denied' });
    }

    await prisma.diagram.delete({
      where: { id }
    });

    res.json({ message: 'Diagram deleted successfully' });
  } catch (error: any) {
    console.error('Delete diagram error:', error);
    res.status(500).json({ error: 'Failed to delete diagram' });
  }
};

// Add block to diagram
export const addBlockToDiagram = async (req: AuthRequest, res: Response) => {
  try {
    const { diagramId, blockId } = req.params;
    const { x = 0, y = 0, width = 120, height = 80 } = req.body;

    // Check if user has access to the diagram
    const diagram = await prisma.diagram.findFirst({
      where: {
        id: diagramId,
        model: {
          OR: [
            { userId: req.user!.id },
            { shares: { some: { userId: req.user!.id, permission: 'edit' } } }
          ]
        }
      }
    });

    if (!diagram) {
      return res.status(404).json({ error: 'Diagram not found or access denied' });
    }

    // Check if block exists in the same model
    const block = await prisma.block.findFirst({
      where: {
        id: blockId,
        modelId: diagram.modelId
      }
    });

    if (!block) {
      return res.status(404).json({ error: 'Block not found in this model' });
    }

    // Add block to diagram (or update position if already exists)
    const diagramBlock = await prisma.diagramBlock.upsert({
      where: {
        diagramId_blockId: {
          diagramId,
          blockId
        }
      },
      update: {
        x: parseFloat(x),
        y: parseFloat(y),
        width: width ? parseFloat(width) : undefined,
        height: height ? parseFloat(height) : undefined
      },
      create: {
        diagramId,
        blockId,
        x: parseFloat(x),
        y: parseFloat(y),
        width: width ? parseFloat(width) : undefined,
        height: height ? parseFloat(height) : undefined
      },
      include: {
        block: true
      }
    });

    res.json(diagramBlock);
  } catch (error: any) {
    console.error('Add block to diagram error:', error);
    res.status(500).json({ error: 'Failed to add block to diagram' });
  }
};

// Remove block from diagram
export const removeBlockFromDiagram = async (req: AuthRequest, res: Response) => {
  try {
    const { diagramId, blockId } = req.params;

    // Check if user has access to the diagram
    const diagram = await prisma.diagram.findFirst({
      where: {
        id: diagramId,
        model: {
          OR: [
            { userId: req.user!.id },
            { shares: { some: { userId: req.user!.id, permission: 'edit' } } }
          ]
        }
      }
    });

    if (!diagram) {
      return res.status(404).json({ error: 'Diagram not found or access denied' });
    }

    await prisma.diagramBlock.delete({
      where: {
        diagramId_blockId: {
          diagramId,
          blockId
        }
      }
    });

    res.json({ message: 'Block removed from diagram successfully' });
  } catch (error: any) {
    console.error('Remove block from diagram error:', error);
    res.status(500).json({ error: 'Failed to remove block from diagram' });
  }
};
