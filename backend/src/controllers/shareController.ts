import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

// POST /share - Share a model with another user by email
export const shareModel = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId, email, permission = 'view' } = req.body;
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

    // Find the user to share with by email
    const targetUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true }
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    // Prevent sharing with self
    if (targetUser.id === userId) {
      return res.status(400).json({ message: 'Cannot share model with yourself' });
    }

    // Check if already shared
    const existingShare = await prisma.modelShare.findFirst({
      where: { modelId, userId: targetUser.id }
    });

    if (existingShare) {
      // Update existing share permission
      const updatedShare = await prisma.modelShare.update({
        where: { id: existingShare.id },
        data: { permission },
        include: {
          user: { select: { id: true, email: true, name: true } },
          model: { select: { id: true, name: true } }
        }
      });

      return res.json({
        message: 'Share permission updated successfully',
        share: updatedShare
      });
    }

    // Create new share
    const share = await prisma.modelShare.create({
      data: {
        modelId,
        userId: targetUser.id,
        permission
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        model: { select: { id: true, name: true } }
      }
    });

    res.status(201).json({
      message: 'Model shared successfully',
      share
    });
  } catch (error) {
    console.error('Share model error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /shared - Get models shared with the current user
export const getSharedModels = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sharedModels = await prisma.modelShare.findMany({
      where: { userId },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, email: true, name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      message: 'Shared models retrieved successfully',
      sharedModels: sharedModels.map(share => ({
        id: share.id,
        permission: share.permission,
        sharedAt: share.createdAt,
        model: share.model
      }))
    });
  } catch (error) {
    console.error('Get shared models error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /shares/:modelId - Get all shares for a specific model (owner only)
export const getModelShares = async (req: AuthRequest, res: Response) => {
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

    const shares = await prisma.modelShare.findMany({
      where: { modelId },
      include: {
        user: { select: { id: true, email: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      message: 'Model shares retrieved successfully',
      shares
    });
  } catch (error) {
    console.error('Get model shares error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /shares/:shareId - Remove a share (owner only)
export const removeShare = async (req: AuthRequest, res: Response) => {
  try {
    const { shareId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the share and verify ownership
    const share = await prisma.modelShare.findUnique({
      where: { id: shareId },
      include: {
        model: { select: { userId: true } }
      }
    });

    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    if (share.model.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete the share
    await prisma.modelShare.delete({
      where: { id: shareId }
    });

    res.json({ message: 'Share removed successfully' });
  } catch (error) {
    console.error('Remove share error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
