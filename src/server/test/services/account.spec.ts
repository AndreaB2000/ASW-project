import { registerAccount } from '../../src/services/account';
import * as repository from '../../src/repositories/account';
import * as accountFactory from '../../src/models/Account';

jest.mock('../../src/repositories/account');
jest.mock('../../src/models/Account');

describe('registerAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false if the account already exists', async () => {
    (repository.readAllAccounts as jest.Mock).mockResolvedValue([
      { username: 'existingUser', password: 'hashedPassword' },
    ]);

    const result = await registerAccount('existingUser', 'password123');

    expect(result).toBe(false);
  });

  it('should create and return true if account does not exist', async () => {
    const mockAccount = { username: 'newUser', password: 'hashedPassword' };
    (repository.readAllAccounts as jest.Mock).mockResolvedValue([]);
    (accountFactory.create as jest.Mock).mockReturnValue(mockAccount);

    const result = await registerAccount('newUser', 'password123');

    expect(result).toBe(true);
  });

  it('should throw an error if reading accounts fails', async () => {
    (repository.readAllAccounts as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(registerAccount('newUser', 'password123')).rejects.toThrow('Database error');
  });
});
