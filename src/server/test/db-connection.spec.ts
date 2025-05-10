import mongoose from 'mongoose';
import { connectDB } from '../src/config/db-connection';
import { jest, describe, beforeEach, afterEach, it, expect, beforeAll } from '@jest/globals';
import { mockConsole } from './test_utils/mock-console';

jest.mock('dotenv', () => ({ config: jest.fn() }));

describe('connectDB', () => {
  let mockConnect: any;

  beforeAll(mockConsole);

  beforeEach(() => {
    mockConnect = jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({} as any);
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should connect using default values in development/test mode', async () => {
    await connectDB();
    expect(mockConnect).toHaveBeenCalledWith('mongodb://aswuser:password@172.0.0.12:27017/aswdb');
  });

  it('should connect using env variables in production mode', async () => {
    process.env.NODE_ENV = 'production';
    process.env.DB_PROTOCOL = 'mongo';
    process.env.DB_APP_USERNAME = 'user';
    process.env.DB_APP_PASSWORD = 'pass';
    process.env.DB_NAME = 'name';
    process.env.DB_PORT = 'port';
    process.env.DB_IP = 'ip';
    await connectDB();
    expect(mockConnect).toHaveBeenCalledWith('mongo://user:pass@ip:port/name');
  });

  it('should throw if required env vars are missing in production', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.DB_APP_PASSWORD;
    await expect(connectDB()).rejects.toThrow('DB connection failed');
  });
});
