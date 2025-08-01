import {
  registerAccount,
  authenticateAccount,
  getAccount,
  updateEmail,
  updateRating,
  deleteAccount,
} from '../../src/services/account';
import * as repository from '../../src/repositories/account';
import { AccountFactory } from '../../src/models/Account';
import { jest, describe, it, expect, beforeAll } from '@jest/globals';
import { Account } from '../../src/models/Account';
import { Rating, RatingFactory } from '../../src/models/Rating';

let existingUser: Account;
let newRating: Rating;

jest.mock('../../src/repositories/account', () => ({
  readAllAccounts: jest.fn(() => Promise.resolve([existingUser])),
  createAccount: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccount: jest.fn(),
}));

describe('Account Service', () => {
  beforeAll(async () => {
    existingUser = await AccountFactory.createWithHashing(
      'existingUser',
      'existing@email.com',
      'hashedPassword',
      RatingFactory.create(1500),
    );
    newRating = RatingFactory.create(1800);
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

  describe('updateEmail', () => {
    it('should return false if email is already taken', async () => {
      const newEmail = existingUser.email;
      const result = await updateEmail(existingUser, newEmail);
      expect(result).toBe(false);
      expect(repository.readAllAccounts).toHaveBeenCalled();
    });

    it('should return false if email is invalid', async () => {
      const invalidEmail = 'invalid-email';
      const result = await updateEmail(existingUser, invalidEmail);
      expect(result).toBe(false);
      expect(repository.updateAccount).not.toHaveBeenCalled();
    });

    it('should update the email if valid and unique', async () => {
      const newEmail = 'new@email.com';
      const result = await updateEmail(existingUser, newEmail);
      expect(result).toBe(true);
    });
  });

  describe('updateRating', () => {
    it('should return true if the rating has been changed', async () => {
      const result = await updateRating(existingUser, newRating);
      expect(result).toBe(true);
      expect(repository.updateAccount).toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('should throw an error if account does not exist', async () => {
      jest.spyOn(require('../../src/services/account'), 'getAccount').mockResolvedValueOnce(null);
      await expect(deleteAccount('nonexistent')).rejects.toThrow('Account not found');
    });

    it('should call repository.deleteAccount with the found account', async () => {
      const mockAccount = existingUser;
      jest
        .spyOn(require('../../src/services/account'), 'getAccount')
        .mockResolvedValueOnce(mockAccount);
      (repository.deleteAccount as jest.Mock).mockReturnValueOnce(true);
      const result = await deleteAccount(mockAccount.username);
      expect(repository.deleteAccount).toHaveBeenCalledWith(mockAccount);
      expect(result).toBe(true);
    });

    it('should return false if repository.deleteAccount returns false', async () => {
      const mockAccount = existingUser;
      jest
        .spyOn(require('../../src/services/account'), 'getAccount')
        .mockResolvedValueOnce(mockAccount);
      (repository.deleteAccount as jest.Mock).mockReturnValueOnce(false);
      const result = await deleteAccount(mockAccount.username);
      expect(repository.deleteAccount).toHaveBeenCalledWith(mockAccount);
      expect(result).toBe(false);
    });
  });
});
