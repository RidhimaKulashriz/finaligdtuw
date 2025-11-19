import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['articles', 'videos', 'hotlines', 'websites', 'other'],
  },
  url: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Resource = mongoose.model<IResource>('Resource', resourceSchema);

export default Resource;
