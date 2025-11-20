import { Document, Model, Types } from 'mongoose';

export interface ICommunityPost extends Document {
  _id: Types.ObjectId;
  content: string;
  userId: Types.ObjectId;
  // Add other fields as needed
  createdAt: Date;
  updatedAt: Date;
}

declare const CommunityPost: Model<ICommunityPost>;
export default CommunityPost;
