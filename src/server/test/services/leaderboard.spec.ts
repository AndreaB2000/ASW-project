import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getTop5, getPlayerRanking } from '../../src/services/leaderboard';
import * as playerRepository from '../../src/repositories/player';

jest.mock('../../src/repositories/player');

describe('Leaderboard Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getTop5', () => {
    it('should return top 5 players sorted by rating and username', async () => {
      const mockPlayers = [
        { username: 'player5', rating: 1000 },
        { username: 'player3', rating: 1500 },
        { username: 'player1', rating: 2000 },
        { username: 'player2', rating: 2000 },
        { username: 'player4', rating: 1500 },
        { username: 'player6', rating: 800 },
        { username: 'player7', rating: 500 },
      ];

      (playerRepository.readAllPlayers as jest.Mock).mockReturnValue(mockPlayers);

      const result = await getTop5();

      expect(result).toHaveLength(5);
      expect(result[0].username).toBe('player1');
      expect(result[1].username).toBe('player2');
      expect(result[2].username).toBe('player3');
      expect(result[3].username).toBe('player4');
      expect(result[4].username).toBe('player5');
      expect(playerRepository.readAllPlayers).toHaveBeenCalledTimes(1);
    });

    it('should return all players when there are fewer than 5', async () => {
      const mockPlayers = [
        { username: 'player1', rating: 2000 },
        { username: 'player2', rating: 1500 },
        { username: 'player3', rating: 1000 },
      ];

      (playerRepository.readAllPlayers as jest.Mock).mockReturnValue(mockPlayers);

      const result = await getTop5();

      expect(result).toHaveLength(3);
      expect(result[0].username).toBe('player1');
      expect(result[0].rating).toBe(2000);
      expect(result[1].username).toBe('player2');
      expect(result[2].username).toBe('player3');
    });

    it('should return an empty array when there are no players', async () => {
      (playerRepository.readAllPlayers as jest.Mock).mockReturnValue([]);

      const result = await getTop5();

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe('getPlayerRanking', () => {
    it('should return the correct ranking for a player', async () => {
      const mockPlayers = [
        { username: 'player2', rating: 2000 },
        { username: 'player1', rating: 2000 },
        { username: 'player3', rating: 1500 },
        { username: 'player4', rating: 1000 },
      ];

      (playerRepository.readAllPlayers as jest.Mock).mockReturnValue(mockPlayers);

      const result = await getPlayerRanking('player3');

      expect(result).toBe(2);
      expect(playerRepository.readAllPlayers).toHaveBeenCalledTimes(1);
    });

    it('should return -1 when the player does not exist', async () => {
      const mockPlayers = [
        { username: 'player1', rating: 2000 },
        { username: 'player2', rating: 1500 },
      ];

      (playerRepository.readAllPlayers as jest.Mock).mockReturnValue(mockPlayers);

      const result = await getPlayerRanking('nonexistent');

      expect(result).toBe(-1);
    });

    it('should handle sorting correctly when finding a player ranking', async () => {
      const mockPlayers = [
        { username: 'player3', rating: 1000 },
        { username: 'player2', rating: 1500 },
        { username: 'player1', rating: 2000 },
      ];

      (playerRepository.readAllPlayers as jest.Mock).mockReturnValue(mockPlayers);

      const result = await getPlayerRanking('player3');

      expect(result).toBe(2);
    });

    it('should correctly rank players with the same rating', async () => {
      const mockPlayers = [
        { username: 'charlie', rating: 1500 },
        { username: 'alice', rating: 1500 },
        { username: 'bob', rating: 1500 },
      ];

      (playerRepository.readAllPlayers as jest.Mock).mockReturnValue(mockPlayers);

      const result1 = await getPlayerRanking('alice');
      const result2 = await getPlayerRanking('bob');
      const result3 = await getPlayerRanking('charlie');

      expect(result1).toBe(0);
      expect(result2).toBe(1);
      expect(result3).toBe(2);
    });
  });
});
