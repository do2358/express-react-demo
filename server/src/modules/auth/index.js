import express from 'express';
import * as authController from './controller.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './validation.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), authController.registerUser);
router.post('/login', validate(loginSchema), authController.loginUser);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logoutUser);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
