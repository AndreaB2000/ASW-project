import { registerAccount } from '../../src/services/account';
import * as repository from '../../src/repositories/account';
import * as accountFactory from '../../src/models/Account';
import { jest, describe, it, expect } from '@jest/globals';

const existingUser = accountFactory.create('existingUser', 'existing@email.com', 'hashedPassword');

jest.mock('../../src/repositories/account', () => ({
  readAllAccounts: jest.fn(() => Promise.resolve([existingUser])),
  createAccount: jest.fn(),
}));

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
