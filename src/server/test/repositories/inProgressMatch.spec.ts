import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  createMatch,
  deleteMatch,
  findMatch,
  updateMatch,
} from '../../src/repositories/inProgressMatch';
import * as matchFactory from '../../src/models/Match';
import { Match } from '../../src/models/Match';

describe('Match Repository', () => {
  const PLAYER1 = 'Alice';
  const PLAYER2 = 'Bob';
  const PLAYER3 = 'Carl';
  const NOW = new Date();
  const NON_EXISTENT_ID = 'testid';
  const testMatch: Match = matchFactory.create(PLAYER1, PLAYER2, NOW);
  const testUpdatedMatch: Match = matchFactory.create(PLAYER3, PLAYER2, NOW);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMatch', () => {
    it('should create a new match with a unique ID', async () => {
      const matchId = await createMatch(testMatch);

      expect(matchId).toBeDefined();
      expect(matchId).toHaveLength(8);
      expect(matchId).toMatch(/^[0-9a-f]{8}$/);
    });

    it('should store the match in the in-progress map', async () => {
      const matchId = await createMatch(testMatch);
      const storedMatch = await findMatch(matchId);

      expect(storedMatch).toEqual(testMatch);
    });
  });

  describe('findMatch', () => {
    it('should return null for non-existent match', async () => {
      const result = await findMatch(NON_EXISTENT_ID);
      expect(result).toBeNull();
    });

    it('should return a clone of the stored match', async () => {
      const matchId = await createMatch(testMatch);
      const result = await findMatch(matchId);

      expect(result).toEqual(testMatch);
      expect(result).not.toBe(testMatch); // Verifica che sia un clone
    });
  });

  describe('updateMatch', () => {
    it('should update an existing match', async () => {
      const matchId = await createMatch(testMatch);

      // The updated match differs on the player1 name (PLAYER1 -> PLAYER3)
      await updateMatch(matchId, testUpdatedMatch);
      const result = await findMatch(matchId);

      expect(result).not.toBeNull();
      expect(result?.player1).toBe(PLAYER3);
    });
  });

  describe('deleteMatch', () => {
    it('should delete an existing match', async () => {
      const matchId = await createMatch(testMatch);
      const result = await deleteMatch(matchId);

      expect(result).toBe(true);
      expect(await findMatch(matchId)).toBeNull();
    });

    it('should return false for non-existent match', async () => {
      const result = await deleteMatch(NON_EXISTENT_ID);
      expect(result).toBe(false);
    });
  });
});
