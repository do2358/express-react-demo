import asyncHandler from '../../middlewares/asyncHandler.js';
import { successResponse } from '../../utils/response.js';
import * as authService from './service.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  
  successResponse(res, result, 'User registered successfully', 201);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authService.login(email, password);
  
  successResponse(res, result, 'Login successful');
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  const result = await authService.refreshAccessToken(refreshToken);
  
  successResponse(res, result, 'Token refreshed successfully');
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  // In a production app, you might want to blacklist the token
  // For now, we'll just return success
  successResponse(res, null, 'Logout successful');
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    phone: req.user.phone,
    role: req.user.role,
  };
  
  successResponse(res, { user }, 'User retrieved successfully');
});
