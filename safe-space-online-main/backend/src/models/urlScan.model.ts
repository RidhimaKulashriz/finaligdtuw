import { Schema, model, Document } from 'mongoose';

export interface IUrlScan extends Document {
  userId: Schema.Types.ObjectId;
  url: string;
  result: {
    isSafe: boolean;
    reason?: string;
    riskScore?: number;
    categories?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const urlScanSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    url: {
      type: String,
      required: [true, 'Please provide a URL to scan'],
      trim: true,
    },
    result: {
      isSafe: {
        type: Boolean,
        required: true,
      },
      reason: {
        type: String,
      },
      riskScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      categories: {
        type: [String],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUrlScan>('UrlScan', urlScanSchema);
