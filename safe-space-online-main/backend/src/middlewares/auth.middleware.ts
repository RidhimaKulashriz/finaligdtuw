import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.model';

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role?: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
        return;
      }

      // Check if MongoDB is available and if it's a mock token
      if (mongoose.connection.readyState !== 1 && token.startsWith('mock_jwt_token_')) {
        // Development fallback: use mock authentication
        console.warn('⚠️  Using mock authentication in development mode');
        req.user = {
          id: token.replace('mock_jwt_token_', 'mock_'),
          username: 'mockuser',
          role: 'teen',
        };
        next();
        return;
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      req.user = {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      };

      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
    return;
  }
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      if (token) {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; username: string };

        // Get user from the token
        const user = await User.findById(decoded.id).select('-password');

        if (user) {
          req.user = {
            id: user._id.toString(),
            username: user.username,
            role: user.role,
          };
        }
      }
    } catch (error) {
      // Token is invalid but we don't throw error for optional auth
      console.error('Optional auth error:', error);
    }
  }

  next();
};
