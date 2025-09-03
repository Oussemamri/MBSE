import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middlewares/auth';

export const getRequirements = async (req: AuthRequest, res: Response) => {
  try {
    const requirements = await prisma.requirement.findMany({
      where: { userId: req.user!.id },
      include: {
        model: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ requirements });
  } catch (error) {
    console.error('Get requirements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createRequirement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, status, modelId } = req.body;

    const requirement = await prisma.requirement.create({
      data: {
        title,
        description,
        priority,
        status,
        userId: req.user!.id,
        modelId
      },
      include: {
        model: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({
      message: 'Requirement created successfully',
      requirement
    });
  } catch (error) {
    console.error('Create requirement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateRequirement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, modelId } = req.body;

    const existingRequirement = await prisma.requirement.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!existingRequirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    const requirement = await prisma.requirement.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(modelId !== undefined && { modelId })
      },
      include: {
        model: {
          select: { id: true, name: true }
        }
      }
    });

    res.json({
      message: 'Requirement updated successfully',
      requirement
    });
  } catch (error) {
    console.error('Update requirement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteRequirement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const requirement = await prisma.requirement.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    await prisma.requirement.delete({
      where: { id }
    });

    res.json({ message: 'Requirement deleted successfully' });
  } catch (error) {
    console.error('Delete requirement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get requirements by model ID
export const getModelRequirements = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId } = req.params;

    // Verify user has access to the model
    const model = await prisma.model.findFirst({
      where: {
        id: modelId,
        OR: [
          { userId: req.user!.id },
          {
            shares: {
              some: {
                userId: req.user!.id
              }
            }
          }
        ]
      }
    });

    if (!model) {
      return res.status(404).json({ error: 'Model not found or access denied' });
    }

    const requirements = await prisma.requirement.findMany({
      where: { 
        modelId,
        userId: req.user!.id 
      },
      include: {
        links: {
          select: {
            blockId: true,
            id: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ requirements });
  } catch (error) {
    console.error('Get model requirements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get traceability matrix for a model
export const getTraceabilityMatrix = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId } = req.params;

    // Verify user has access to the model
    const model = await prisma.model.findFirst({
      where: {
        id: modelId,
        OR: [
          { userId: req.user!.id },
          {
            shares: {
              some: {
                userId: req.user!.id
              }
            }
          }
        ]
      }
    });

    if (!model) {
      return res.status(404).json({ error: 'Model not found or access denied' });
    }

    // Get requirements for this model
    const requirements = await prisma.requirement.findMany({
      where: { 
        modelId,
        userId: req.user!.id 
      },
      orderBy: { title: 'asc' }
    });

    // Get blocks for this model
    const blocks = await prisma.block.findMany({
      where: { modelId },
      orderBy: { name: 'asc' }
    });

    // Get all links for this model
    const links = await prisma.link.findMany({
      where: { modelId },
      select: {
        requirementId: true,
        blockId: true
      }
    });

    res.json({
      requirements,
      blocks,
      links,
      matrix: {
        requirements: requirements.map(req => ({
          ...req,
          linkedBlocks: links.filter(l => l.requirementId === req.id).map(l => l.blockId)
        })),
        blocks: blocks.map(block => ({
          ...block,
          linkedRequirements: links.filter(l => l.blockId === block.id).map(l => l.requirementId)
        }))
      }
    });
  } catch (error) {
    console.error('Get traceability matrix error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Link a requirement to blocks
export const linkRequirementToBlocks = async (req: AuthRequest, res: Response) => {
  try {
    const { id: requirementId } = req.params;
    const { blockIds, modelId } = req.body;

    // Verify requirement exists and user owns it
    const requirement = await prisma.requirement.findFirst({
      where: {
        id: requirementId,
        userId: req.user!.id
      }
    });

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    // Verify user has access to the model
    const model = await prisma.model.findFirst({
      where: {
        id: modelId,
        OR: [
          { userId: req.user!.id },
          {
            shares: {
              some: {
                userId: req.user!.id,
                permission: 'edit'
              }
            }
          }
        ]
      }
    });

    if (!model) {
      return res.status(404).json({ error: 'Model not found or access denied' });
    }

    // Remove existing links for this requirement
    await prisma.link.deleteMany({
      where: {
        requirementId,
        modelId
      }
    });

    // Create new links
    const linksData = blockIds.map((blockId: string) => ({
      requirementId,
      blockId,
      modelId
    }));

    if (linksData.length > 0) {
      await prisma.link.createMany({
        data: linksData
      });
    }

    res.json({ message: 'Requirement links updated successfully' });
  } catch (error) {
    console.error('Link requirement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unlink a requirement from a specific block
export const unlinkRequirementFromBlock = async (req: AuthRequest, res: Response) => {
  try {
    const { id: requirementId, blockId } = req.params;

    // Find and verify ownership through requirement
    const requirement = await prisma.requirement.findFirst({
      where: {
        id: requirementId,
        userId: req.user!.id
      }
    });

    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    // Delete the specific link
    const deletedLink = await prisma.link.deleteMany({
      where: {
        requirementId,
        blockId
      }
    });

    if (deletedLink.count === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Link removed successfully' });
  } catch (error) {
    console.error('Unlink requirement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
