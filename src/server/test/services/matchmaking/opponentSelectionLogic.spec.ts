import { PlayerFactory } from '../../../src/models/Player';
import { RatingFactory } from '../../../src/models/Rating';
import { isValidMatch } from '../../../src/services/matchmaking/opponentSelectionLogic';
import { jest, describe, it, expect } from '@jest/globals';

jest.mock('../../../src/repositories/player', () => ({
  readPlayerByUsername: jest.fn((username: string) => {
    if (username === 'validUsername')
      return PlayerFactory.create(username, RatingFactory.create(1500));
    if (username === 'lowPlayer')
      return PlayerFactory.create(username, RatingFactory.create(1400));
    if (username === 'highPlayer')
      return PlayerFactory.create(username, RatingFactory.create(1500));
    return null;
  }),
}));

describe('opponentSelectionLogic', () => {
  describe('isValidMatch', () => {
    it('should return false if either player does not exist', async () => {
      const validUsername: string = 'validUsername';
      const nonExistingUsername: string = 'nonExistingUsername'
      const maxDiff: number = 100;

      let result = await isValidMatch(validUsername, nonExistingUsername, maxDiff);
      expect(result).toEqual(false);
      result = await isValidMatch(nonExistingUsername, validUsername, maxDiff);
      expect(result).toEqual(false);
    });

    it('should return false if players rating difference is too high', async () => {
      const lowPlayer: string = 'lowPlayer';
      const highPlayer: string = 'highPlayer';
      const maxDiff: number = 50;

      let result = await isValidMatch(lowPlayer, highPlayer, maxDiff);
      expect(result).toEqual(false);
    });

    it('should return true if players rating difference within range', async () => {
      const lowPlayer: string = 'lowPlayer';
      const highPlayer: string = 'highPlayer';
      const maxDiff: number = 100;

      let result = await isValidMatch(lowPlayer, highPlayer, maxDiff);
      expect(result).toEqual(true);
    });
  });

});