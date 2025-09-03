import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  model: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    diagramData: Joi.object().optional()
  }),

  requirement: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    status: Joi.string().valid('open', 'in_progress', 'completed', 'cancelled').optional(),
    modelId: Joi.string().optional()
  }),

  link: Joi.object({
    blockId: Joi.string().required(),
    requirementId: Joi.string().required(),
    modelId: Joi.string().required()
  }),

  block: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    type: Joi.string().valid('COMPONENT', 'SUBSYSTEM', 'FUNCTION').optional(),
    modelId: Joi.string().required(),
    parentId: Joi.string().optional().allow(null)
  }),

  blockUpdate: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional().allow(null),
    type: Joi.string().valid('COMPONENT', 'SUBSYSTEM', 'FUNCTION').optional(),
    parentId: Joi.string().optional().allow(null)
  }),

  share: Joi.object({
    email: Joi.string().email().required(),
    permission: Joi.string().valid('view', 'edit').default('view')
  })
};
