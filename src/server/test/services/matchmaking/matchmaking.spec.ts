import { findSuitableOpponent } from '../../../src/services/matchmaking/matchmaking';
import { MatchmakingCandidateFactory } from '../../../src/models/MatchmakingCandidate';
import { MatchmakingQueueFactory } from '../../../src/models/MatchmakingQueue';
import { jest, describe, it, expect } from '@jest/globals';
import * as opponentSelectionLogic from '../../../src/services/matchmaking/opponentSelectionLogic';

const playerId = 'player';
const requestedTime: Date = new Date('2023-10-01T00:00:00Z');
const candidate = MatchmakingCandidateFactory.create(playerId, requestedTime);

// Mocking to simulate matchmaking queue in db
jest.mock('../../../src/repositories/matchmakingQueue', () => ({
  getQueue: jest.fn(() => {
    return MatchmakingQueueFactory.create([candidate]);
  }),
}));
// Mocking to simulate player in db
jest.mock('../../../src/repositories/player', () => ({
  readPlayerByUsername: jest.fn(() => ({
    username: 'requestingPlayer',
    rating: {
      value: 1500,
      deviation: 0,
      volatility: 0,
    },
  })),
}));

describe('matchmaking service', () => {
  describe('findSuitableOpponent', () => {
    it('should return a suitable opponent if present', async () => {
      const requestingPlayerId = 'requestingPlayer';

      const result = await findSuitableOpponent(requestingPlayerId);
      expect(result).toEqual(candidate.username);
    });

    it('should return null if no suitable opponent is present', async () => {
      const requestingPlayerId = 'requestingPlayer';
      jest.spyOn(opponentSelectionLogic, 'evaluateOpponentMatch').mockResolvedValue(false);

      const result = await findSuitableOpponent(requestingPlayerId);
      expect(result).toBe(undefined);
    });
  });
});
