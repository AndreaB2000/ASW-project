import { register, RegisterResult } from '../../src/controllers/account';
import { registerAccount } from '../../src/services/account';
import { Account } from '../../src/models/Account';
import { jest, describe, it, expect, beforeAll } from '@jest/globals';
import { mockConsole } from '../test_utils/mock-console';

// Mock the registerAccount function
jest.mock('../../src/services/account', () => ({
  registerAccount: jest.fn(),
}));

const mockedRegisterAccount = registerAccount as jest.MockedFunction<typeof registerAccount>;

describe('register', () => {
  const validAccount: Account = {
    username: 'testuser',
    hashedPassword: 'hashedPass123',
    checkPassword: () => Promise.resolve(true),
  };

  beforeAll(mockConsole);

  it('should return error if username is missing', async () => {
    const account = { ...validAccount, username: '' };
    const result = await register(account as Account);
    expect(result).toEqual(new RegisterResult(false, 'Username and password are required', ''));
  });

  it('should return error if password is missing', async () => {
    const account = { ...validAccount, hashedPassword: '' };
    const result = await register(account as Account);
    expect(result).toEqual(
      new RegisterResult(false, 'Username and password are required', 'testuser'),
    );
  });

  it('should return failure if registerAccount returns false', async () => {
    mockedRegisterAccount.mockResolvedValueOnce(false);
    const result = await register(validAccount);
    expect(result).toEqual(new RegisterResult(false, 'Account already exists', 'testuser'));
  });

  it('should return success if registerAccount returns true', async () => {
    mockedRegisterAccount.mockResolvedValueOnce(true);
    const result = await register(validAccount);
    expect(result).toEqual(new RegisterResult(true, 'Account created successfully', 'testuser'));
  });

  it('should handle exceptions and return internal server error', async () => {
    mockedRegisterAccount.mockImplementationOnce(() => {
      throw new Error('Database error');
    });
    const result = await register(validAccount);
    expect(result).toEqual(new RegisterResult(false, 'Internal server error', 'testuser'));
  });
});
