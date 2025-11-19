import 'express';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface User {
      id: mongoose.Types.ObjectId;
      role: string;
      username?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
