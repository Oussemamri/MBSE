import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middlewares/auth';

export const getModels = async (req: AuthRequest, res: Response) => {
  try {
    const models = await prisma.model.findMany({
      where: {
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
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        shares: {
          where: { userId: req.user!.id },
          select: { permission: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Parse diagramData for all models
    const modelsWithParsedData = models.map(model => ({
      ...model,
      diagramData: model.diagramData ? JSON.parse(model.diagramData) : null
    }));

    res.json({ models: modelsWithParsedData });
  } catch (error) {
    console.error('Get models error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getModel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const model = await prisma.model.findFirst({
      where: {
        id,
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
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        shares: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // Parse diagramData back to JSON for the response
    const modelWithParsedData = {
      ...model,
      diagramData: model.diagramData ? JSON.parse(model.diagramData) : null
    };

    res.json({ model: modelWithParsedData });
  } catch (error) {
    console.error('Get model error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createModel = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, diagramData } = req.body;

    const model = await prisma.model.create({
      data: {
        name,
        description,
        diagramData: diagramData ? JSON.stringify(diagramData) : null,
        userId: req.user!.id
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Parse diagramData back to JSON for the response
    const modelWithParsedData = {
      ...model,
      diagramData: model.diagramData ? JSON.parse(model.diagramData) : null
    };

    res.status(201).json({
      message: 'Model created successfully',
      model: modelWithParsedData
    });
  } catch (error) {
    console.error('Create model error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateModel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, diagramData } = req.body;

    // Check if user owns the model or has edit permission
    const existingModel = await prisma.model.findFirst({
      where: {
        id,
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

    if (!existingModel) {
      return res.status(404).json({ error: 'Model not found or insufficient permissions' });
    }

    const model = await prisma.model.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(diagramData && { diagramData: JSON.stringify(diagramData) })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Parse diagramData back to JSON for the response
    const modelWithParsedData = {
      ...model,
      diagramData: model.diagramData ? JSON.parse(model.diagramData) : null
    };

    res.json({
      message: 'Model updated successfully',
      model: modelWithParsedData
    });
  } catch (error) {
    console.error('Update model error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteModel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const model = await prisma.model.findFirst({
      where: {
        id,
        userId: req.user!.id // Only owner can delete
      }
    });

    if (!model) {
      return res.status(404).json({ error: 'Model not found or insufficient permissions' });
    }

    await prisma.model.delete({
      where: { id }
    });

    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error('Delete model error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
