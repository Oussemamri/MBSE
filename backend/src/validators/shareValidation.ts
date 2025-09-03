import Joi from 'joi';

export const shareModelSchema = Joi.object({
  modelId: Joi.string().required().messages({
    'string.empty': 'Model ID is required',
    'any.required': 'Model ID is required'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Valid email is required',
    'any.required': 'Email is required'
  }),
  permission: Joi.string().valid('view', 'edit').default('view').messages({
    'any.only': 'Permission must be either "view" or "edit"'
  })
});

export const modelIdParamSchema = Joi.object({
  modelId: Joi.string().required().messages({
    'string.empty': 'Model ID is required',
    'any.required': 'Model ID is required'
  })
});

export const shareIdParamSchema = Joi.object({
  shareId: Joi.string().required().messages({
    'string.empty': 'Share ID is required',
    'any.required': 'Share ID is required'
  })
});
