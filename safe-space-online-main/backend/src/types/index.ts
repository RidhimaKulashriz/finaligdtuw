import { Document, Types } from 'mongoose';

// Community Post
export interface ICommunityPost extends Document {
  _id: Types.ObjectId;
  content: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Message Scan
export interface IMessageScan extends Document {
  _id: Types.ObjectId;
  message: string;
  result: {
    isSafe: boolean;
    issues?: string[];
  };
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// URL Scan
export interface IUrlScan extends Document {
  _id: Types.ObjectId;
  url: string;
  result: {
    isSafe: boolean;
    reason?: string;
    riskScore?: number;
    categories?: string[];
  };
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Types
export interface DashboardAchievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface DashboardActivity {
  type: 'url' | 'message' | 'post';
  content: string;
  riskScore: number;
  timestamp: Date;
}
