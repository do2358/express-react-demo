import jwt from 'jsonwebtoken';
import User from '../user/model.js';

// Generate JWT access token
export const generateAccessToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

// Generate JWT refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, tokenId: Date.now().toString() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Register new user
export const register = async (userData) => {
  const { email, password, name, phone } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    error.code = 'AUTH_001';
    throw error;
  }

  // Create user
  const user = await User.create({
    email,
    password,
    name,
    phone,
  });

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.email, user.role);
  const refreshToken = generateRefreshToken(user._id);

  return {
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

// Login user
export const login = async (email, password) => {
  // Find user with password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'AUTH_001';
    throw error;
  }

  // Check if user is active
  if (!user.isActive) {
    const error = new Error('Account is inactive');
    error.statusCode = 401;
    error.code = 'AUTH_001';
    throw error;
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'AUTH_001';
    throw error;
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.email, user.role);
  const refreshToken = generateRefreshToken(user._id);

  return {
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      error.code = 'AUTH_002';
      throw error;
    }

    const accessToken = generateAccessToken(user._id, user.email, user.role);
    
    return { accessToken };
  } catch (error) {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    err.code = 'AUTH_002';
    throw err;
  }
};
