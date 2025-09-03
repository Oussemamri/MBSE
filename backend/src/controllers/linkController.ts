import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

// POST /links - Create a new link between a block and requirement
export const createLink = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId, blockId, requirementId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the user owns the model
    const model = await prisma.model.findFirst({
      where: { id: modelId, userId }
    });

    if (!model) {
      return res.status(404).json({ message: 'Model not found or access denied' });
    }

    // Verify the requirement exists and belongs to the user
    const requirement = await prisma.requirement.findFirst({
      where: { id: requirementId, userId }
    });

    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found or access denied' });
    }

    // Check if link already exists
    const existingLink = await prisma.link.findFirst({
      where: { modelId, blockId, requirementId }
    });

    if (existingLink) {
      return res.status(409).json({ message: 'Link already exists' });
    }

    // Create the link
    const link = await prisma.link.create({
      data: {
        modelId,
        blockId,
        requirementId
      },
      include: {
        requirement: {
          select: {
            id: true,
            title: true,
            description: true,
            priority: true,
            status: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Link created successfully',
      link
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /links/:modelId - Get all links for a specific model
export const getModelLinks = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the user owns the model
    const model = await prisma.model.findFirst({
      where: { id: modelId, userId }
    });

    if (!model) {
      return res.status(404).json({ message: 'Model not found or access denied' });
    }

    // Get all links for the model
    const links = await prisma.link.findMany({
      where: { modelId },
      include: {
        requirement: {
          select: {
            id: true,
            title: true,
            description: true,
            priority: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      message: 'Links retrieved successfully',
      links
    });
  } catch (error) {
    console.error('Get model links error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /links/:linkId - Delete a specific link
export const deleteLink = async (req: AuthRequest, res: Response) => {
  try {
    const { linkId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the link and verify ownership through the model
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: {
        model: { select: { userId: true } }
      }
    });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.model.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete the link
    await prisma.link.delete({
      where: { id: linkId }
    });

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /links/block/:modelId/:blockId - Get all links for a specific block
export const getBlockLinks = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId, blockId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the user owns the model
    const model = await prisma.model.findFirst({
      where: { id: modelId, userId }
    });

    if (!model) {
      return res.status(404).json({ message: 'Model not found or access denied' });
    }

    // Get all links for the specific block
    const links = await prisma.link.findMany({
      where: { modelId, blockId },
      include: {
        requirement: {
          select: {
            id: true,
            title: true,
            description: true,
            priority: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      message: 'Block links retrieved successfully',
      links
    });
  } catch (error) {
    console.error('Get block links error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
