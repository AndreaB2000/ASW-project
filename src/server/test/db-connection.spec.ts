import mongoose from 'mongoose';
import { connectDB } from '../src/db-connection';
import { jest } from '@jest/globals';
import { checkCalledWith } from './test_utils/check-called';
import { mockConsole } from './test_utils/mock-console';

beforeEach(() => {
  process.env.DB_PROTOCOL = 'testProtocol';
  process.env.DB_APP_USERNAME = 'testUser';
  process.env.DB_APP_PASSWORD = 'testPassword';
  process.env.DB_NAME = 'testDB';
  process.env.DB_PORT = 'testPort';
  process.env.DB_IP = 'testIP';
  mockConsole();
});

afterEach(() => {
  jest.resetAllMocks();
});

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Db Connection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call mongoose.connect with values taken from process.env', async () => {
    const testUri = 'testProtocol://testUser:testPassword@testIP:testPort/testDB';
    const mockConnect = jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({} as any);
    await connectDB();
    expect(mockConnect).toHaveBeenCalledWith(testUri);
  });

  it('should throw an error if any of the required environment variables are missing', async () => {
    delete process.env.DB_PROTOCOL;
    await checkCalledWith(connectDB, [1], process, 'exit', null, []);
  });
});
