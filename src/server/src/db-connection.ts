import mongoose from 'mongoose';

/**
 * Connects to MongoDB using Mongoose.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
