import { createAccount, readAllAccounts } from '../../src/repositories/account';
import * as accountFactory from '../../src/models/Account';
import { jest, expect, it, describe, afterEach } from '@jest/globals';

jest.mock('../models/Account', () => ({
  create: jest.fn(),
}));

describe('accountService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should save a new user to the database', async () => {
      const saveMock = jest.fn();
      mockModel.mockImplementation(() => ({ save: saveMock }));

      const account = { username: 'testuser', hashedPassword: 'hashed123' };

      await createAccount(account);

      expect(mockModel).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'hashed123',
      });
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('readAllAccounts', () => {
    it('should fetch all users and convert them using accountFactory', async () => {
      const fakeUsers = [
        { username: 'user1', password: 'pass1' },
        { username: 'user2', password: 'pass2' },
      ];

      (mockModel.find as jest.Mock).mockResolvedValue(fakeUsers);
      (accountFactory.create as jest.Mock).mockImplementation((username, password) => ({
        username,
        hashedPassword: password,
      }));

      const result = await readAllAccounts();

      expect(mockModel.find).toHaveBeenCalled();
      expect(result).toEqual([
        { username: 'user1', hashedPassword: 'pass1' },
        { username: 'user2', hashedPassword: 'pass2' },
      ]);
    });
  });
});
