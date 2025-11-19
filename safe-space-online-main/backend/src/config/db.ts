import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config();

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      // Exit process with failure
      process.exit(1);
    }
  }
};

export { connectDB };
