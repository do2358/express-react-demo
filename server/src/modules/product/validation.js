import Joi from 'joi';

// Create product validation
export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).required(),
  comparePrice: Joi.number().min(0).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('active', 'inactive', 'draft').optional(),
});

// Update product validation
export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  comparePrice: Joi.number().min(0).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  category: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('active', 'inactive', 'draft').optional(),
});
