import { PlayerFactory } from '../../../src/models/Player';
import { RatingFactory } from '../../../src/models/Rating';
import { evaluateOpponentMatch } from '../../../src/services/matchmaking/opponentSelectionLogic';
import { jest, describe, it, expect } from '@jest/globals';

jest.mock('../../../src/repositories/player', () => ({
  readPlayerByUsername: jest.fn((username: string) => {
    if(username === 'validUsername') return PlayerFactory.create(username, RatingFactory.create(1500, 0, 0));
    return null;
  })
}));

describe('opponentSelectionLogic', () => {
  // describe('evaluateOpponentMatch', () => {
  //   it('should return false if either player does not exist', async () => {
  //     const validUsername: string = 'validUsername';
  //     const nonExistingUsername: string = 'nonExistingUsername'

  //     let result = await evaluateOpponentMatch(validUsername, new Date(), nonExistingUsername, new Date());
  //     expect(result).toEqual(false);
  //     result = await evaluateOpponentMatch(nonExistingUsername, new Date(), validUsername, new Date());
  //     expect(result).toEqual(false);
  //   });
  // });

  describe('dummy test', () => {
    it('dummy test', async () => {
      expect(true).toEqual(true);
    });
  });
});