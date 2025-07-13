import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db-connection';
import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { mockConsole } from './test_utils/mock-console';

jest.mock('mongoose');
jest.mock('dotenv', () => ({ config: jest.fn() }));

describe('connectDB', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    mockConsole();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should connect to MongoDB successfully', async () => {
    process.env.DB_APP_USERNAME = 'testuser';
    process.env.DB_APP_PASSWORD = 'testpass';
    process.env.DB_NAME = 'testdb';

    (mongoose.connect as jest.Mock).mockReturnValueOnce({});

    await expect(connectDB()).resolves.toBeUndefined();
    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://testuser:testpass@172.0.0.12:27017/testdb',
    );
  });

  it('should throw an error if required env variables are missing', async () => {
    delete process.env.DB_APP_USERNAME;
    process.env.DB_APP_PASSWORD = 'testpass';
    process.env.DB_NAME = 'testdb';

    await expect(connectDB()).rejects.toThrow('DB connection failed');
    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it('should throw an error if mongoose.connect fails', async () => {
    process.env.DB_APP_USERNAME = 'testuser';
    process.env.DB_APP_PASSWORD = 'testpass';
    process.env.DB_NAME = 'testdb';

    jest.mocked(mongoose.connect).mockRejectedValueOnce(new Error('Connection failed'));

    await expect(connectDB()).rejects.toThrow('DB connection failed');
    expect(mongoose.connect).toHaveBeenCalled();
  });
});
