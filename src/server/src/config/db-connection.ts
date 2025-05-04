import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Connects to MongoDB using Mongoose.
 */
export const connectDB = async (): Promise<void> => {
  try {
    let protocol: string;
    let username: string;
    let password: string;
    let dbName: string;
    let port: string;
    let ip: string;
    if (process.env.NODE_ENV !== 'production') {
      protocol = 'mongodb';
      username = 'aswuser';
      password = 'password';
      dbName = 'aswdb';
      port = '27017';
      ip = '172.0.0.12';
    } else {
      dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '..', '.env') });
      protocol = process.env.DB_PROTOCOL;
      username = process.env.DB_APP_USERNAME;
      password = process.env.DB_APP_PASSWORD;
      dbName = process.env.DB_NAME;
      port = process.env.DB_PORT;
      ip = process.env.DB_IP;
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
    }
    const uri = `${protocol}://${username}:${password}@${ip}:${port}/${dbName}`;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    throw new DOMException('DB connection failed');
  }
};
