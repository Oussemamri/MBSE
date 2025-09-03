import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middlewares/auth';

// Create a new block
export const createBlock = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, type, modelId, parentId } = req.body;

    // Verify the model exists and user has access
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

    // If parentId is provided, verify it exists and belongs to the same model
    if (parentId) {
      const parent = await prisma.block.findFirst({
        where: {
          id: parentId,
          modelId: modelId
        }
      });

      if (!parent) {
        return res.status(404).json({ error: 'Parent block not found' });
      }
    }

    const block = await prisma.block.create({
      data: {
        name,
        description,
        type: type || 'COMPONENT',
        modelId,
        parentId
      },
      include: {
        parent: true,
        children: true
      }
    });

    res.status(201).json({
      message: 'Block created successfully',
      block
    });
  } catch (error) {
    console.error('Create block error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a block
export const updateBlock = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, type, parentId } = req.body;

    // First, find the block and verify access
    const existingBlock = await prisma.block.findFirst({
      where: {
        id,
      },
      include: {
        model: {
          include: {
            shares: true
          }
        }
      }
    });

    if (!existingBlock) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Check if user has access to the model
    const hasAccess = existingBlock.model.userId === req.user!.id ||
      existingBlock.model.shares.some(share => 
        share.userId === req.user!.id && share.permission === 'edit'
      );

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If parentId is provided, verify it exists and belongs to the same model
    if (parentId && parentId !== existingBlock.parentId) {
      const parent = await prisma.block.findFirst({
        where: {
          id: parentId,
          modelId: existingBlock.modelId
        }
      });

      if (!parent) {
        return res.status(404).json({ error: 'Parent block not found' });
      }

      // Prevent circular references
      if (parentId === id) {
        return res.status(400).json({ error: 'Block cannot be its own parent' });
      }

      // Check if the new parent would create a circular reference
      let currentParent = parent;
      while (currentParent?.parentId) {
        if (currentParent.parentId === id) {
          return res.status(400).json({ error: 'Circular reference detected' });
        }
        const nextParent = await prisma.block.findUnique({
          where: { id: currentParent.parentId }
        });
        if (!nextParent) break;
        currentParent = nextParent;
      }
    }

    const updatedBlock = await prisma.block.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(parentId !== undefined && { parentId: parentId || null })
      },
      include: {
        parent: true,
        children: true
      }
    });

    res.json({
      message: 'Block updated successfully',
      block: updatedBlock
    });
  } catch (error) {
    console.error('Update block error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all blocks for a model
export const getModelBlocks = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId } = req.params;

    // Verify the model exists and user has access
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

    const blocks = await prisma.block.findMany({
      where: {
        modelId
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json({ blocks });
  } catch (error) {
    console.error('Get model blocks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a block
export const deleteBlock = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // First, find the block and verify access
    const existingBlock = await prisma.block.findFirst({
      where: {
        id,
      },
      include: {
        model: {
          include: {
            shares: true
          }
        },
        children: true
      }
    });

    if (!existingBlock) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Check if user has access to the model
    const hasAccess = existingBlock.model.userId === req.user!.id ||
      existingBlock.model.shares.some(share => 
        share.userId === req.user!.id && share.permission === 'edit'
      );

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Handle orphaned children by setting their parentId to null
    if (existingBlock.children.length > 0) {
      await prisma.block.updateMany({
        where: {
          parentId: id
        },
        data: {
          parentId: null
        }
      });
    }

    // Delete the block
    await prisma.block.delete({
      where: { id }
    });

    res.json({ message: 'Block deleted successfully' });
  } catch (error) {
    console.error('Delete block error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
