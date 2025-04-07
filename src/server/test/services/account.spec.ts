import { registerAccount } from '../../src/services/account';
import * as repository from '../../src/repositories/account';
import * as accountFactory from '../../src/models/Account';
import { jest, describe, it, expect } from '@jest/globals';

const existingUser = { username: 'existingUser', hashedPassword: 'hashedPsw' };

jest.mock('../../src/repositories/account', () => ({
  readAllAccounts: jest.fn(() => Promise.resolve([existingUser])),
  createAccount: jest.fn(),
}));
jest.mock('../../src/models/Account');

describe('registerAccount', () => {
  it('should return false if account already exists in repository', async () => {
    const result = await registerAccount(existingUser.username, existingUser.hashedPassword);
    expect(result).toBe(false);
    expect(repository.readAllAccounts).toHaveBeenCalled();
  });

  it('should create and store new account if username is unique', async () => {
    const newUser = { username: 'newUser', hashedPassword: 'hashedPsw' };
    const result = await registerAccount(newUser.username, newUser.hashedPassword);
    expect(result).toBe(true);
    expect(repository.readAllAccounts).toHaveBeenCalled();
    expect(accountFactory.createWithHashing).toHaveBeenCalledWith(
      newUser.username,
      newUser.hashedPassword,
    );
    expect(repository.createAccount).toHaveBeenCalledTimes(1);
  });
});
