import Joi from 'joi';

// Register validation
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)/).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.pattern.base': 'Password must contain letters and numbers',
    'any.required': 'Password is required',
  }),
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
  }),
  phone: Joi.string().optional(),
});

// Login validation
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Refresh token validation
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
