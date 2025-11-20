import { Document, Model, Types } from 'mongoose';

export interface IMessageScan extends Document {
  _id: Types.ObjectId;
  message: string;
  result: {
    isSafe: boolean;
    issues?: string[];
  };
  userId: Types.ObjectId;
  // Add other fields as needed
  createdAt: Date;
  updatedAt: Date;
}

declare const MessageScan: Model<IMessageScan>;
export default MessageScan;
