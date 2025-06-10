import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getTop5, getAccountRanking } from '../../src/services/leaderboard';
import * as accountRepository from '../../src/repositories/account';

jest.mock('../../src/repositories/account');

describe('Leaderboard Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getTop5', () => {
    it('should return top 5 accounts sorted by rating and username', async () => {
      const mockAccounts = [
        { username: 'account5', rating: 1000 },
        { username: 'account3', rating: 1500 },
        { username: 'account1', rating: 2000 },
        { username: 'account2', rating: 2000 },
        { username: 'account4', rating: 1500 },
        { username: 'account6', rating: 800 },
        { username: 'account7', rating: 500 },
      ];

      (accountRepository.readAllAccounts as jest.Mock).mockReturnValue(mockAccounts);

      const result = await getTop5();

      expect(result).toHaveLength(5);
      expect(result[0].username).toBe('account1');
      expect(result[1].username).toBe('account2');
      expect(result[2].username).toBe('account3');
      expect(result[3].username).toBe('account4');
      expect(result[4].username).toBe('account5');
      expect(accountRepository.readAllAccounts).toHaveBeenCalledTimes(1);
    });

    it('should return all accounts when there are fewer than 5', async () => {
      const mockAccounts = [
        { username: 'account1', rating: 2000 },
        { username: 'account2', rating: 1500 },
        { username: 'account3', rating: 1000 },
      ];

      (accountRepository.readAllAccounts as jest.Mock).mockReturnValue(mockAccounts);

      const result = await getTop5();

      expect(result).toHaveLength(3);
      expect(result[0].username).toBe('account1');
      expect(result[0].rating).toBe(2000);
      expect(result[1].username).toBe('account2');
      expect(result[2].username).toBe('account3');
    });

    it('should return an empty array when there are no accounts', async () => {
      (accountRepository.readAllAccounts as jest.Mock).mockReturnValue([]);

      const result = await getTop5();

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe('getAccountRanking', () => {
    it('should return the correct ranking for a account', async () => {
      const mockAccounts = [
        { username: 'account2', rating: 2000 },
        { username: 'account1', rating: 2000 },
        { username: 'account3', rating: 1500 },
        { username: 'account4', rating: 1000 },
      ];

      (accountRepository.readAllAccounts as jest.Mock).mockReturnValue(mockAccounts);

      const result = await getAccountRanking('account3');

      expect(result).toBe(2);
      expect(accountRepository.readAllAccounts).toHaveBeenCalledTimes(1);
    });

    it('should return -1 when the account does not exist', async () => {
      const mockAccounts = [
        { username: 'account1', rating: 2000 },
        { username: 'account2', rating: 1500 },
      ];

      (accountRepository.readAllAccounts as jest.Mock).mockReturnValue(mockAccounts);

      const result = await getAccountRanking('nonexistent');

      expect(result).toBe(-1);
    });

    it('should handle sorting correctly when finding a account ranking', async () => {
      const mockAccounts = [
        { username: 'account3', rating: 1000 },
        { username: 'account2', rating: 1500 },
        { username: 'account1', rating: 2000 },
      ];

      (accountRepository.readAllAccounts as jest.Mock).mockReturnValue(mockAccounts);

      const result = await getAccountRanking('account3');

      expect(result).toBe(2);
    });

    it('should correctly rank accounts with the same rating', async () => {
      const mockAccounts = [
        { username: 'charlie', rating: 1500 },
        { username: 'alice', rating: 1500 },
        { username: 'bob', rating: 1500 },
      ];

      (accountRepository.readAllAccounts as jest.Mock).mockReturnValue(mockAccounts);

      const result1 = await getAccountRanking('alice');
      const result2 = await getAccountRanking('bob');
      const result3 = await getAccountRanking('charlie');

      expect(result1).toBe(0);
      expect(result2).toBe(1);
      expect(result3).toBe(2);
    });
  });
});
