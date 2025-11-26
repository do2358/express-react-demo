import Joi from 'joi';

// Add to cart validation
export const addToCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required',
  }),
  quantity: Joi.number().min(1).required().messages({
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
});

// Update cart item validation
export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().min(1).required().messages({
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
});
