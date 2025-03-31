import * as accountFactory from '../../src/models/Account';

describe('Account Value Object', () => {
  const name = 'testName';
  const psw = 'testPassword';

  it('should create an account', () => {
    const account = accountFactory.create(name, psw);
    expect(account).toBeDefined();
  });

  it('should retreive username and password', () => {
    const account = accountFactory.create(name, psw);
    expect(account.username).toBe(name);
    expect(account.password).toBe(psw);
  });
});
