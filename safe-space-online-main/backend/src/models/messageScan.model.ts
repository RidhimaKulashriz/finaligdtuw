import { Document, Schema, model, Model } from 'mongoose';

export interface IMessageScan extends Document {
  userId: Schema.Types.ObjectId;
  message: string;
  result: {
    isSafe: boolean;
    issues?: string[];
  };
  timestamp: Date;
}

const messageScanSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message to scan'],
    },
    result: {
      isSafe: {
        type: Boolean,
        required: true,
      },
      issues: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const MessageScan: Model<IMessageScan> = model<IMessageScan>('MessageScan', messageScanSchema);

export default MessageScan;
