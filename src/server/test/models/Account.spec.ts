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
});
