import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Connects to MongoDB using Mongoose.
 */
export const connectDB = async (): Promise<void> => {
  try {
    dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
    const protocol = process.env.DB_PROTOCOL;
    const username = process.env.DB_APP_USERNAME;
    const password = process.env.DB_APP_PASSWORD;
    const dbName = process.env.DB_NAME;
    const port = process.env.DB_PORT;
    const ip = process.env.DB_IP;
    if (!username || !password || !dbName || !port || !ip || !protocol) {
      let errorMsg =
        'Missing MongoDB credentials. Please verify that the following variables are defined in the .env root file.';
      for (const key of [
        'DB_PROTOCOL',
        'DB_APP_USERNAME',
        'DB_APP_PASSWORD',
        'DB_NAME',
        'DB_PORT',
        'DB_IP',
      ]) {
        if (!process.env[key]) {
          errorMsg += `\n- ${key}`;
        }
      }
      throw new Error(errorMsg);
    }
    const uri = `${protocol}://${username}:${password}@${ip}:${port}/${dbName}`;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
