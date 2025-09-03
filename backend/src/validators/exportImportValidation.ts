import Joi from 'joi';

export const modelIdParamSchema = Joi.object({
  modelId: Joi.string().required().messages({
    'string.empty': 'Model ID is required',
    'any.required': 'Model ID is required'
  })
});

export const importJsonSchema = Joi.object({
  modelName: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Model name is required',
    'string.min': 'Model name must be at least 1 character long',
    'string.max': 'Model name cannot exceed 255 characters',
    'any.required': 'Model name is required'
  }),
  importData: Joi.object({
    metadata: Joi.object().optional(),
    diagram: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      diagramData: Joi.any().required().messages({
        'any.required': 'Diagram data is required'
      })
    }).required().messages({
      'any.required': 'Diagram data is required'
    }),
    requirements: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().optional(),
        priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
        status: Joi.string().valid('open', 'in_progress', 'completed', 'cancelled').optional(),
        createdAt: Joi.string().optional()
      })
    ).optional(),
    links: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        blockId: Joi.string().required(),
        modelId: Joi.string().optional(),
        requirement: Joi.object({
          id: Joi.string().required()
        }).unknown().required(),
        createdAt: Joi.string().optional()
      })
    ).optional()
  }).required().messages({
    'any.required': 'Import data is required'
  })
});
