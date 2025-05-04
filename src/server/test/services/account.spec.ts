import { registerAccount, authenticateAccount } from '../../src/services/account';
import * as repository from '../../src/repositories/account';
import * as accountFactory from '../../src/models/Account';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

const existingUser = accountFactory.create('existingUser', 'existing@email.com', 'hashedPassword');

jest.mock('../../src/repositories/account', () => ({
  readAllAccounts: jest.fn(() => Promise.resolve([existingUser])),
  createAccount: jest.fn(),
}));

describe('Account Service', () => {
  describe('registerAccount', () => {
    it('should return false if account already exists in repository', async () => {
      const result = await registerAccount(existingUser);
      expect(result).toBe(false);
      expect(repository.readAllAccounts).toHaveBeenCalled();
    });

    it('should create and store new account if username is unique', async () => {
      const newUser = await accountFactory.createWithHashing(
        'newUser',
        'new@email.com',
        'hashedPassword',
      );
      const result = await registerAccount(newUser);
      expect(result).toBe(true);
      expect(repository.readAllAccounts).toHaveBeenCalled();
      expect(repository.createAccount).toHaveBeenCalledTimes(1);
    });
  });

  describe('authenticateAccount', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return null if no account matches the email', async () => {
      jest.spyOn(repository, 'readAllAccounts').mockResolvedValue([]);
      const result = await authenticateAccount('nonexistent@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const mockAccount = accountFactory.create('user', 'user@example.com', 'hashedPassword');
      jest.spyOn(repository, 'readAllAccounts').mockResolvedValue([mockAccount]);
      const result = await authenticateAccount('user@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return the account if email and password are correct', async () => {
      const mockAccount = await accountFactory.createWithHashing(
        'user',
        'user@example.com',
        'correctPassword',
      );
      jest.spyOn(repository, 'readAllAccounts').mockResolvedValue([mockAccount]);
      const result = await authenticateAccount(mockAccount.email, 'correctPassword');
      expect(result).toBe(mockAccount);
    });
  });
});
