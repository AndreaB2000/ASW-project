import { registerAccount, authenticateAccount, getAccount } from '../../src/services/account';
import * as repository from '../../src/repositories/account';
import { AccountFactory } from '../../src/models/Account';
import { jest, describe, it, expect, beforeAll } from '@jest/globals';
import { Account } from '../../src/models/Account';

let existingUser: Account;

jest.mock('../../src/repositories/account', () => ({
  readAllAccounts: jest.fn(() => Promise.resolve([existingUser])),
  createAccount: jest.fn(),
}));

describe('Account Service', () => {
  beforeAll(async () => {
    existingUser = await AccountFactory.createWithHashing(
      'existingUser',
      'existing@email.com',
      'hashedPassword',
    );
  });

  describe('registerAccount', () => {
    it('should return false if account already exists in repository', async () => {
      const result = await registerAccount(existingUser);
      expect(result).toBe(false);
      expect(repository.readAllAccounts).toHaveBeenCalled();
    });

    it('should create and store new account if username is unique', async () => {
      const newUser = await AccountFactory.createWithHashing(
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
    it('should return null if no account matches the username', async () => {
      const result = await authenticateAccount('nonexistent', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const result = await authenticateAccount(existingUser.username, 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return the account if username and password are correct', async () => {
      const result = await authenticateAccount(existingUser.username, 'hashedPassword');
      expect(result).toBe(existingUser);
    });
  });

  describe('getAccount', () => {
    it('should return null if no account matches the username', async () => {
      const result = await getAccount('nonexistent');
      expect(result).toBeNull();
    });

    it('should return the account if username exists', async () => {
      const result = await getAccount(existingUser.username);
      expect(result).toBe(existingUser);
    });
  });
});
