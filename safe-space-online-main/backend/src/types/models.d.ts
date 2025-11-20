// src/types/models.d.ts
import type { Document, Model, Types } from 'mongoose';

// Global type augmentations
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

// Base model interface
export interface BaseModel extends Document {
  createdAt: Date;
  updatedAt: Date;
}

// Message Scan interface
export interface IMessageScan extends Document {
  userId: Types.ObjectId;
  message: string;
  result: {
    isSafe: boolean;
    issues: string[];
  };
  timestamp: Date;
}

// URL Scan interface
export interface IUrlScan extends Document {
  url: string;
  result: {
    isSafe: boolean;
    reason?: string;
    riskScore?: number;
    categories?: string[];
  };
  timestamp: Date;
}

// Model types
export type MessageScanModel = Model<IMessageScan>;
export type UrlScanModel = Model<IUrlScan>;