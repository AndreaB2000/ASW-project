import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Connects to MongoDB using Mongoose.
 */
export const connectDB = async (): Promise<void> => {
  try {
    let protocol: string;
    let ip: string;
    let port: number;
    let dbName: string;
    let username: string;
    let password: string;

    dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '..', '.env') });
    protocol = 'mongodb';
    ip = '172.0.0.12';
    port = 27017;
    dbName = process.env.DB_NAME;
    username = process.env.DB_APP_USERNAME;
    password = process.env.DB_APP_PASSWORD;

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
    console.log('Connecting to MongoDB...', uri);
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    throw new DOMException('DB connection failed');
  }
};
