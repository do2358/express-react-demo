import Joi from 'joi';

// Create inventory validation
export const createInventorySchema = Joi.object({
  product: Joi.string().required().messages({
    'any.required': 'Product ID is required',
  }),
  quantity: Joi.number().min(0).required(),
  warehouse: Joi.string().optional(),
  lowStockThreshold: Joi.number().min(0).optional(),
});

// Update inventory validation
export const updateInventorySchema = Joi.object({
  quantity: Joi.number().min(0).optional(),
  warehouse: Joi.string().optional(),
  lowStockThreshold: Joi.number().min(0).optional(),
});

// Adjust stock validation
export const adjustStockSchema = Joi.object({
  product: Joi.string().required(),
  adjustment: Joi.number().required().messages({
    'any.required': 'Adjustment amount is required',
  }),
  reason: Joi.string().optional(),
});
