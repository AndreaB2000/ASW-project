import { createAccount, readAllAccounts } from '../../src/repositories/account';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// Mock bcrypt
jest.mock('bcrypt');

describe('Account Repository', () => {
  const mockAccount = {
    username: 'testuser',
    password: 'testpassword',
  };

  const mockHashedPassword = 'hashedpassword123';

  // Mock DBAccount model
  const mockSave = jest.fn();
  const mockConstructor = jest.fn(function (data) {
    this.username = data.username;
    this.password = data.password;
    this.save = mockSave;
    return this;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock bcrypt.hash
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

    // Mock mongoose model to return our mock constructor
    (mongoose.model as jest.Mock).mockReturnValue(mockConstructor);
  });

  describe('createAccount', () => {
    it('should hash the password and save the account', async () => {
      mockSave.mockResolvedValue(true);

      await createAccount(mockAccount);

      // Verify bcrypt.hash was called correctly
      expect(bcrypt.hash).toHaveBeenCalledWith(mockAccount.password, 10);

      // Verify mongoose model was called with correct name
      expect(mongoose.model).toHaveBeenCalledWith('Account', expect.any(mongoose.Schema));

      // Verify constructor was called with correct data
      expect(mockConstructor).toHaveBeenCalledWith({
        username: mockAccount.username,
        password: mockHashedPassword,
      });

      // Verify save was called
      expect(mockSave).toHaveBeenCalled();

      // Verify console.log was called
      expect(console.log).toHaveBeenCalledWith(`User created: ${mockAccount.username}`);
    });

    it('should throw an error if saving fails', async () => {
      const error = new Error('Save failed');
      mockSave.mockRejectedValue(error);

      await expect(createAccount(mockAccount)).rejects.toThrow(error);
    });
  });

  describe('readAllAccounts', () => {
    it('should return all accounts with passwords', async () => {
      const mockAccountsFromDB = [
        {
          username: 'user1',
          password: 'hash1',
          toObject: () => ({ username: 'user1', password: 'hash1' }),
        },
        {
          username: 'user2',
          password: 'hash2',
          toObject: () => ({ username: 'user2', password: 'hash2' }),
        },
      ];

      // Mock DB find operation
      mongoose.model('Account').find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAccountsFromDB),
      });

      const result = await readAllAccounts();

      // Verify correct DB query was made
      expect(mongoose.model('Account').find).toHaveBeenCalledWith({}, 'username');

      // Verify correct transformation of data
      expect(result).toEqual([
        { username: 'user1', password: 'hash1' },
        { username: 'user2', password: 'hash2' },
      ]);
    });

    it('should return empty array if no accounts exist', async () => {
      mongoose.model('Account').find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue([]),
      });

      const result = await readAllAccounts();
      expect(result).toEqual([]);
    });
  });
});
