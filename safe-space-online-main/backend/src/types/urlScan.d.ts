import { Document, Model, Types } from 'mongoose';

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
  // Add other fields as needed
  createdAt: Date;
  updatedAt: Date;
}

declare const UrlScan: Model<IUrlScan>;
export default UrlScan;
