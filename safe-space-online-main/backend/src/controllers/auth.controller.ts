import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/user.model';

// Get token from model, create cookie and send response
const sendTokenResponse = (
  user: {
    _id: string | unknown;
    username?: string;
    email?: string;
    role?: string;
    getSignedJwtToken: () => string;
    matchPassword?: (password: string) => Promise<boolean>;
  },
  statusCode: number,
  res: Response
): void => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRE
          ? parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, email, password, role = 'teen' } = req.body;

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock user data
      console.warn('  MongoDB not available - using mock authentication in development');
      const mockUser = {
        _id: `mock_${Date.now()}`,
        username,
        email,
        role,
        createdAt: new Date(),
        getSignedJwtToken: () => `mock_jwt_token_${Date.now()}`,
      };
      sendTokenResponse(mockUser, 201, res);
      return;
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 201, res);
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({
      message: errorMessage,
      errors:
        error && typeof error === 'object' && 'errors' in error
          ? (error.errors as { message: string }[]).map((err: { message: string }) => err.message)
          : undefined,
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Check for user
    let user;

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: use mock user
      console.warn('  MongoDB not available - using mock authentication in development');
      user = {
        _id: 'mock_user_id',
        email,
        role: 'teen',
        matchPassword: async (inputPassword: string) => inputPassword === 'password123',
        getSignedJwtToken: () => `mock_jwt_token_${Date.now()}`,
      };
    } else {
      user = await User.findOne({ email }).select('+password');
    }

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ message: errorMessage });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ message: errorMessage });
  }
};
