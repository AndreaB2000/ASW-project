import { DBAccount } from '../../src/repositories/account';
import { createAccount, readAllAccounts } from '../../src/repositories/account';
import { jest, describe, it, beforeEach } from '@jest/globals';
import * as accountFactory from '../../src/models/Account';
import { checkCalled } from '../test_utils/check-called';

describe('Account Repository', () => {
  const testUsername = 'testUser';
  const testPassword = 'testPassword';
  const testAccount = accountFactory.createWithHashing(testUsername, testPassword);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should call save on DB instance', async () => {
      await checkCalled(createAccount, DBAccount.prototype, 'save', null, [testAccount]);
    });
  });

  describe('readAllAccounts', () => {
    it('should call find with correct parameters', async () => {
      const mockPlayers = [
        { username: 'user1', hashedPassword: 'hashedPassword1' },
        { username: 'user2', hashedPassword: 'hashedPassword2' },
      ];

      await checkCalled(readAllAccounts, DBAccount, 'find', mockPlayers, []);
    });
  });
});
