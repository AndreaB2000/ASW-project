import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

/**
 * Connects to MongoDB using Mongoose.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const host = process.env.MONGO_HOST || 'mongodb';
    const ip = process.env.MONGO_IP || '127.0.0.1';
    const port = process.env.MONGO_PORT || '27017';
    const dbName = process.env.MONGO_DB || 'ASW-DB';
    const username = process.env.MONGO_USERNAME || 'user';
    const passwordFile =
      process.env.MONGO_PASSWORD_FILE ||
      path.join(__dirname, '..', 'secrets', 'mongo_root_password.txt');
    fs.readFile(passwordFile, 'utf8', async (err, password) => {
      if (err) {
        console.error('Error reading password file:', err);
        return;
      }
      const uri = `${host}://${ip}:${port}/${dbName}`;
      console.log(`Connecting to ${uri}`);
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
