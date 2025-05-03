import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { setTimeout } from 'timers/promises';

const RETRY_DELAY_MS = 1000;

/**
 * Tries to connect to MongoDB with a given milliseconds timeout
 * and a given amount of attempts.
 */
const connectWithTimeoutAndRetries = async (
  uri: string,
  timeout: number,
  retries: number,
): Promise<void> => {
  let attempt = 0;

  while (attempt < retries) {
    attempt++;
    console.log(`Connection attempt ${attempt}/${retries}...`);

    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: timeout }).catch(_error => {
        throw new Error(`${timeout} ms timeout expired.`);
      });

      return;
    } catch (error) {
      console.error(`Attempt failed:`, error.message);

      if (attempt < retries) {
        console.log('Retrying...');
        await setTimeout(RETRY_DELAY_MS);
      }
    }
  }

  throw new Error(`Failed connection to MongoDB after ${retries} attempts.`);
};

/**
 * Connects to MongoDB using Mongoose.
 */
export const connectDB = async (): Promise<void> => {
  try {
    dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
    const protocol = process.env.DB_PROTOCOL;
    const username = process.env.DB_APP_USERNAME;
    const password = process.env.DB_APP_PASSWORD;
    const dbName = process.env.DB_NAME || 'aswdb';
    const port = process.env.DB_PORT || '27017';
    const ip = process.env.DB_IP || 'localhost';
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
    await connectWithTimeoutAndRetries(uri, 6000, 10);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
