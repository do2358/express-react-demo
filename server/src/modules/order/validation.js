import Joi from 'joi';

// Create order validation
export const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    district: Joi.string().optional(),
    ward: Joi.string().optional(),
    notes: Joi.string().optional(),
  }).required(),
  paymentMethod: Joi.string().valid('cod', 'banking').default('cod'),
  notes: Joi.string().optional(),
});

// Update order status validation
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
    .required(),
  note: Joi.string().optional(),
});
