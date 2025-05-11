import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  findSuitableOpponent,
  findMatchOrQueue,
} from '../../../src/services/matchmaking/matchmaking';
import * as matchmakingQueueRepo from '../../../src/repositories/matchmakingQueue';
import * as playerRepo from '../../../src/repositories/player';
import * as opponentSelectionLogic from '../../../src/services/matchmaking/opponentSelectionLogic';
import {
  MatchmakingCandidate,
  MatchmakingCandidateFactory,
} from '../../../src/models/MatchmakingCandidate';
import { RatingFactory } from '../../../src/models/Rating';
import { MatchmakingQueueFactory } from '../../../src/models/MatchmakingQueue';

describe('Matchmaking Service', () => {
  // Mock dependencies
  beforeEach(() => {
    jest.spyOn(matchmakingQueueRepo, 'getQueue').mockImplementation(jest.fn() as any);
    jest.spyOn(matchmakingQueueRepo, 'addCandidate').mockImplementation(jest.fn() as any);
    jest.spyOn(matchmakingQueueRepo, 'removeCandidate').mockImplementation(jest.fn() as any);
    jest.spyOn(playerRepo, 'readPlayerByUsername').mockImplementation(jest.fn() as any);
    jest.spyOn(opponentSelectionLogic, 'isValidMatch').mockImplementation(jest.fn() as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findSuitableOpponent', () => {
    it('should return undefined when queue is empty', async () => {
      // Setup
      (matchmakingQueueRepo.getQueue as jest.Mock).mockImplementation(() => MatchmakingQueueFactory.create([]) as any);

      const requestingCandidate = MatchmakingCandidateFactory.create(
        'testPlayer',
        RatingFactory.create(1500),
        new Date(),
      );

      // Execute
      const result = await findSuitableOpponent(requestingCandidate);

      // Verify
      expect(result).toBeUndefined();
      expect(matchmakingQueueRepo.getQueue).toHaveBeenCalledTimes(1);
    });

    it('should return the first matching opponent from the queue', async () => {
      // Setup
      const candidate1 = MatchmakingCandidateFactory.create(
        'player1',
        RatingFactory.create(1500),
        new Date(),
      );

      const candidate2 = MatchmakingCandidateFactory.create(
        'player2',
        RatingFactory.create(1600),
        new Date(),
      );

      const candidate3 = MatchmakingCandidateFactory.create(
        'player3',
        RatingFactory.create(1700),
        new Date(),
      );

      (matchmakingQueueRepo.getQueue as jest.Mock).mockImplementation(() => MatchmakingQueueFactory.create([
        candidate1,
        candidate2,
        candidate3,
      ]) as any);
      (opponentSelectionLogic.isValidMatch as jest.Mock).mockImplementation((async (c1: MatchmakingCandidate, c2: MatchmakingCandidate) => {
        // Make only candidate2 match
        return c2.username === 'player2';
      }) as any );

      const requestingCandidate = MatchmakingCandidateFactory.create(
        'testPlayer',
        RatingFactory.create(1550),
        new Date(),
      );

      // Execute
      const result = await findSuitableOpponent(requestingCandidate);

      // Verify
      expect(result).toBe('player2');
      expect(matchmakingQueueRepo.getQueue).toHaveBeenCalledTimes(1);
      expect(opponentSelectionLogic.isValidMatch).toHaveBeenCalledTimes(2); // It should stop after finding a match
    });

    it('should return undefined when no suitable opponent is found', async () => {
      // Setup
      const candidate1 = MatchmakingCandidateFactory.create(
        'player1',
        RatingFactory.create(1500),
        new Date(),
      );

      const candidate2 = MatchmakingCandidateFactory.create(
        'player2',
        RatingFactory.create(1600),
        new Date(),
      );

      (matchmakingQueueRepo.getQueue as jest.Mock).mockImplementation(() => MatchmakingQueueFactory.create([candidate1, candidate2]) as any);
      (opponentSelectionLogic.isValidMatch as jest.Mock).mockImplementation(() => false as any);

      const requestingCandidate = MatchmakingCandidateFactory.create(
        'testPlayer',
        RatingFactory.create(2000),
        new Date(),
      );

      // Execute
      const result = await findSuitableOpponent(requestingCandidate);

      // Verify
      expect(result).toBeUndefined();
      expect(matchmakingQueueRepo.getQueue).toHaveBeenCalledTimes(1);
      expect(opponentSelectionLogic.isValidMatch).toHaveBeenCalledTimes(2); // Should check all candidates
    });
  });

  describe('findMatchOrQueue', () => {
    it('should return opponent username and remove from queue when suitable opponent found', async () => {
      // Setup
      const player = {
        username: 'testPlayer',
        rating: RatingFactory.create(1500),
      };

      (playerRepo.readPlayerByUsername as jest.Mock).mockImplementation(() => player as any);
      (matchmakingQueueRepo.getQueue as jest.Mock).mockImplementation(() => MatchmakingQueueFactory.create([
        MatchmakingCandidateFactory.create('opponent', RatingFactory.create(1600), new Date()),
      ]) as any);
      (opponentSelectionLogic.isValidMatch as jest.Mock).mockImplementation(() => true as any);

      // Execute
      const result = await findMatchOrQueue('testPlayer');

      // Verify
      expect(result).toBe('opponent');
      expect(playerRepo.readPlayerByUsername).toHaveBeenCalledWith('testPlayer');
      expect(matchmakingQueueRepo.removeCandidate).toHaveBeenCalledWith('opponent');
      expect(matchmakingQueueRepo.addCandidate).not.toHaveBeenCalled();
    });

    it('should add player to queue and return undefined when no suitable opponent found', async () => {
      // Setup
      const player = {
        username: 'testPlayer',
        rating: RatingFactory.create(1500),
      };

      (playerRepo.readPlayerByUsername as jest.Mock).mockImplementation(() => player as any);
      (matchmakingQueueRepo.getQueue as jest.Mock).mockImplementation(() => MatchmakingQueueFactory.create([]) as any);
      const mockAddCandidate = jest.fn();
      (matchmakingQueueRepo.addCandidate as jest.Mock).mockImplementation(mockAddCandidate as any);

      // Execute
      const result = await findMatchOrQueue('testPlayer');

      // Verify
      expect(result).toBeUndefined();
      expect(playerRepo.readPlayerByUsername).toHaveBeenCalledWith('testPlayer');
      expect(matchmakingQueueRepo.removeCandidate).not.toHaveBeenCalled();
      expect(matchmakingQueueRepo.addCandidate).toHaveBeenCalledTimes(1);
      // Check that addCandidate was called with a MatchmakingCandidate that has the correct username and rating
      expect(mockAddCandidate).toBeCalledWith(expect.objectContaining({
        username: 'testPlayer',
        rating: expect.objectContaining({
          value: 1500,
        }),
      }));
    });

    it('should handle the case when player rating is much higher than others in queue', async () => {
      // Setup
      const player = {
        username: 'highRatedPlayer',
        rating: RatingFactory.create(2000),
      };

      const queuePlayers = [
        MatchmakingCandidateFactory.create('player1', RatingFactory.create(1500), new Date()),
        MatchmakingCandidateFactory.create('player2', RatingFactory.create(1600), new Date()),
      ];

      (playerRepo.readPlayerByUsername as jest.Mock).mockImplementation(() => player as any);
      (matchmakingQueueRepo.getQueue as jest.Mock).mockImplementation(() => queuePlayers as any);
      (opponentSelectionLogic.isValidMatch as jest.Mock).mockImplementation(() => false as any); // No match due to rating difference

      // Execute
      const result = await findMatchOrQueue('highRatedPlayer');

      // Verify
      expect(result).toBeUndefined();
      expect(matchmakingQueueRepo.removeCandidate).not.toHaveBeenCalled();
      expect(matchmakingQueueRepo.addCandidate).toHaveBeenCalledTimes(1);
      expect(opponentSelectionLogic.isValidMatch).toHaveBeenCalledTimes(2); // Called for both players in queue
    });
  });
});
