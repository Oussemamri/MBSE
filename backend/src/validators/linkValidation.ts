import Joi from 'joi';

export const createLinkSchema = Joi.object({
  modelId: Joi.string().required().messages({
    'string.empty': 'Model ID is required',
    'any.required': 'Model ID is required'
  }),
  blockId: Joi.string().required().messages({
    'string.empty': 'Block ID is required',
    'any.required': 'Block ID is required'
  }),
  requirementId: Joi.string().required().messages({
    'string.empty': 'Requirement ID is required',
    'any.required': 'Requirement ID is required'
  })
});

export const modelIdSchema = Joi.object({
  modelId: Joi.string().required().messages({
    'string.empty': 'Model ID is required',
    'any.required': 'Model ID is required'
  })
});

export const blockLinksSchema = Joi.object({
  modelId: Joi.string().required().messages({
    'string.empty': 'Model ID is required',
    'any.required': 'Model ID is required'
  }),
  blockId: Joi.string().required().messages({
    'string.empty': 'Block ID is required',
    'any.required': 'Block ID is required'
  })
});
