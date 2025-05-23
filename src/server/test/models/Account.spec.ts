import { describe, it, expect } from '@jest/globals';
import { AccountFactory } from '../../src/models/Account';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';
import { RatingFactory } from '../../src/models/Rating';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => Promise.resolve('salt')),
  hash: jest.fn((password, salt) => Promise.resolve(`hashed_${password}_${salt}`)),
  compare: jest.fn((_, _1) => Promise.resolve(true)),
}));

describe('Account', () => {
  const plainPassword = 'mySecret123!';
  const email = 'test@email.com';
  const username = 'testUser';

  it('should create an account with a hashed password using createWithHashing', async () => {
    const account = await AccountFactory.createWithHashing(username, email, plainPassword);
    expect(account.username).toBe(username);
    expect(account.hashedPassword).toBe(await bcrypt.hash(plainPassword, await bcrypt.genSalt()));
  });

  it('should exploit bcrypt to check password with checkPassword', async () => {
    const account = await AccountFactory.createWithHashing(username, email, plainPassword);
    await account.checkPassword("doesn't matter");
    expect(bcrypt.compare).toBeCalledTimes(1);
  });

  it('should not accept an invalid email', async () => {
    const invalidEmail = 'invalidEmail';
    await expect(AccountFactory.createWithHashing(username, invalidEmail, plainPassword)).rejects.toThrow(
      'Invalid email',
    );
  });

  it('should not accept an invalid username', async () => {
    const invalidUsername = 'tooLongUsernameThatExceedsTheLimit';
    await expect(AccountFactory.createWithHashing(invalidUsername, email, plainPassword)).rejects.toThrow(
      'Invalid username',
    );
  });

  it('should create an account with a provided hashed password using create', async () => {
    const hashedPassword = await bcrypt.hash(plainPassword, await bcrypt.genSalt());
    const account = AccountFactory.create(username, email, hashedPassword);
    expect(account.username).toBe(username);
    expect(account.hashedPassword).toBe(hashedPassword);
  });

  it('should create an account with a default rating using create', async () => {
    const account = AccountFactory.create(username, email, 'hashedPassword');
    expect(account.username).toBe(username);
    expect(account.email).toBe(email);
    expect(account.hashedPassword).toBe('hashedPassword');
    expect(account.rating).toStrictEqual(RatingFactory.create());
  });

  it('should not accept an invalid email when changing it', async () => {
    const account = await AccountFactory.createWithHashing(username, email, plainPassword);
    const invalidEmail = 'invalidEmail';
    expect(account.changeEmail(invalidEmail)).toBe(false);
  });

  it('should change the email of the account', async () => {
    const account = await AccountFactory.createWithHashing(username, email, plainPassword);
    const newEmail = 'newEmail@mail.it';
    account.changeEmail(newEmail);
    expect(account.email).toBe(newEmail);
  });
});
