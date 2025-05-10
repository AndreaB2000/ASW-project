import {
  findSuitableOpponent,
  findMatchOrQueue,
} from '../../../src/services/matchmaking/matchmaking';
import { MatchmakingCandidateFactory } from '../../../src/models/MatchmakingCandidate';
import { MatchmakingQueueFactory } from '../../../src/models/MatchmakingQueue';
import { jest, describe, it, expect } from '@jest/globals';
import * as opponentSelectionLogic from '../../../src/services/matchmaking/opponentSelectionLogic';
import * as matchmakingQueueRepository from '../../../src/repositories/matchmakingQueue';

const username = 'player';
const requestedTime: Date = new Date('2023-10-01T00:00:00Z');
const candidate = MatchmakingCandidateFactory.create(username, requestedTime);

// Mocking to simulate matchmaking queue in db
jest.mock('../../../src/repositories/matchmakingQueue', () => ({
  getQueue: jest.fn(() => {
    return MatchmakingQueueFactory.create([candidate]);
  }),
  addCandidate: jest.fn(() => {
    return undefined;
  }),
}));
// Mocking to simulate player in db
jest.mock('../../../src/repositories/player', () => ({
  readPlayerByUsername: jest.fn((username: string) => {
    if (username === 'requestingPlayer') {
      return {
        username: 'requestingPlayer',
        rating: {
          value: 1500,
        }
      };
    } else if (username === 'player') {
      return {
        username: 'player',
        rating: {
          value: 1500,
        }
      };
    }
  }),
}));

describe('matchmaking service', () => {
  describe('findSuitableOpponent', () => {
    it('should return a suitable opponent if present', async () => {
      const requestingPlayerId = 'requestingPlayer';

      const result = await findSuitableOpponent(requestingPlayerId);
      expect(result).toEqual(candidate.username);
    });

    // it('should return null if no suitable opponent is present', async () => {
    //   const requestingPlayerId = 'requestingPlayer';
    //   jest.spyOn(opponentSelectionLogic, 'isValidMatch').mockResolvedValue(false);

    //   const result = await findSuitableOpponent(requestingPlayerId);
    //   expect(result).toEqual(undefined);
    // });
  });

  // describe('findOpponentOrAddToQueue', () => {
  //   it('should return a suitable opponent if one is found', async () => {
  //     const requestingPlayerId = 'requestingPlayer';

  //     // Mock findSuitableOpponent to return a suitable opponent
  //     jest.spyOn(opponentSelectionLogic, 'isValidMatch').mockResolvedValue(true);

  //     const result = await findMatchOrQueue(requestingPlayerId);

  //     expect(result).toEqual(candidate.username);
  //   });

  //   it('should add the player to the queue if no suitable opponent is found', async () => {
  //     const requestingPlayerId = 'requestingPlayer';
  //     const date = new Date();

  //     // Mock findSuitableOpponent to return no suitable opponent
  //     jest.spyOn(opponentSelectionLogic, 'isValidMatch').mockResolvedValue(false);

  //     // Mock the current date
  //     jest.spyOn(global, 'Date').mockImplementation(() => date);

  //     // Spy on addCandidate to ensure it is called
  //     const addCandidateSpy = jest.spyOn(matchmakingQueueRepository, 'addCandidate');

  //     const result = await findMatchOrQueue(requestingPlayerId);

  //     expect(result).toBeUndefined();
  //     expect(addCandidateSpy).toHaveBeenCalledWith(
  //       MatchmakingCandidateFactory.create(requestingPlayerId, date),
  //     );
    // });
  // });
});
