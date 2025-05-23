import {
  DBAccount,
  deleteAccount,
  readAccountByUsername,
  updateAccount,
} from '../../src/repositories/account';
import { createAccount, readAllAccounts } from '../../src/repositories/account';
import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { AccountFactory } from '../../src/models/Account';
import { checkCalled, checkCalledWith } from '../test_utils/check-called';
import { RatingFactory } from '../../src/models/Rating';

describe('Account Repository', () => {
  const testUsername = 'testUser';
  const testEmail = 'test@email.com';
  const testPassword = 'testPassword';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should call save on DB instance', async () => {
      const testAccount = await AccountFactory.createWithHashing(
        testUsername,
        testEmail,
        testPassword,
        RatingFactory.create(),
      );
      await checkCalled(createAccount, DBAccount.prototype, 'save', null, [testAccount]);
    });
  });

  describe('readAllAccounts', () => {
    it('should call find with correct parameters', async () => {
      const mockPlayers = [
        {
          username: 'user1',
          email: 'test1@test.com',
          hashedPassword: 'hashedPassword1',
          rating: { value: 1500 },
        },
        {
          username: 'user2',
          email: 'test2@test.com',
          hashedPassword: 'hashedPassword2',
          rating: { value: 1500 },
        },
      ];

      await checkCalled(readAllAccounts, DBAccount, 'find', mockPlayers, []);
    });
  });

  // New test cases
  describe('readAccountByUsername', () => {
    it('should call findOne with correct parameters', async () => {
      const mockAccount = {
        username: testUsername,
        email: testEmail,
        password: testPassword,
        rating: { value: 1500 },
      };

      await checkCalledWith(
        readAccountByUsername,
        [{ username: testUsername }],
        DBAccount,
        'findOne',
        mockAccount,
        [testUsername],
      );
    });

    it('should return null when account not found', async () => {
      await checkCalledWith(
        readAccountByUsername,
        [{ username: testUsername }],
        DBAccount,
        'findOne',
        null,
        [testUsername],
      );
    });
  });

  describe('updateAccount', () => {
    it('should call updateOne with correct parameters', async () => {
      const testRating = RatingFactory.create();
      const testAccount = AccountFactory.create(testUsername, testEmail, testPassword, testRating);
      const expectedResult = { modifiedCount: 1 };

      await checkCalledWith(
        updateAccount,
        [
          { username: testUsername },
          {
            email: testEmail,
            password: testPassword,
            rating: { value: testRating.value },
          },
        ],
        DBAccount,
        'updateOne',
        expectedResult,
        [testAccount],
      );
    });

    it('should return false when no account was updated', async () => {
      const testRating = RatingFactory.create();
      const testAccount = AccountFactory.create(testUsername, testEmail, testPassword, testRating);
      const expectedResult = { modifiedCount: 0 };

      const result = await checkCalledWith(
        updateAccount,
        [
          { username: testUsername },
          {
            email: testEmail,
            password: testPassword,
            rating: { value: testRating.value },
          },
        ],
        DBAccount,
        'updateOne',
        expectedResult,
        [testAccount],
      );

      expect(result).toBe(false);
    });
  });

  describe('deleteAccount', () => {
    it('should call deleteOne with correct parameters', async () => {
      const expectedResult = { deletedCount: 1 };

      await checkCalledWith(
        deleteAccount,
        [{ username: testUsername }],
        DBAccount,
        'deleteOne',
        expectedResult,
        [testUsername],
      );
    });

    it('should return false when no account was deleted', async () => {
      const expectedResult = { deletedCount: 0 };

      const result = await checkCalledWith(
        deleteAccount,
        [{ username: testUsername }],
        DBAccount,
        'deleteOne',
        expectedResult,
        [testUsername],
      );

      expect(result).toBe(false);
    });
  });
});
