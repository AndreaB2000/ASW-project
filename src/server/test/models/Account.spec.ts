import { describe, it, expect } from '@jest/globals';
import { createWithHashing, create } from '../../src/models/Account';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => Promise.resolve('salt')),
  hash: jest.fn((password, salt) => Promise.resolve(`hashed_${password}_${salt}`)),
  compare: jest.fn((_, _1) => Promise.resolve(true)),
}));

describe('Account', () => {
  const plainPassword = 'mySecret123!';
  const username = 'testUser';

  it('should create an account with a hashed password using createWithHashing', async () => {
    const account = await createWithHashing(username, plainPassword);

    expect(account.username).toBe(username);
    expect(account.hashedPassword).toBe(await bcrypt.hash(plainPassword, await bcrypt.genSalt()));
  });

  it('should exploit bcrypt to check password with checkPassword', async () => {
    const account = await createWithHashing(username, plainPassword);
    await account.checkPassword("doesn't matter");
    expect(bcrypt.compare).toBeCalledTimes(1);
  });

  it('should create an account with a provided hashed password using create', async () => {
    const hashedPassword = await bcrypt.hash(plainPassword, await bcrypt.genSalt());
    const account = await create(username, hashedPassword);

    expect(account.username).toBe(username);
    expect(account.hashedPassword).toBe(hashedPassword);
  });
});
