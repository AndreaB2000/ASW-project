import { describe, it, beforeEach, jest } from '@jest/globals';
import { MatchRepository } from '../../src/repositories/match';
import {
  createMatch,
  deleteMatch,
  findMatch,
  findMatchesByPlayer,
  updateMatch,
} from '../../src/repositories/inProgressMatch';
import { Match, MatchFactory } from '../../src/models/Match';
import { checkCalledWith } from '../test_utils/check-called';

describe('Match Repository', () => {
  const player1 = 'Alice';
  const player2 = 'Bob';
  const player3 = 'Carl';
  const NOW = new Date();
  const testId = '507f1f77bcf86cd799439011';
  const mockMatch: Match = MatchFactory.createWithDefaultInitialState(player1, player2, NOW);
  const mockUpdatedMatch: Match = MatchFactory.createWithDefaultInitialState(player3, player2, NOW);
  let matchRepository: MatchRepository = new MatchRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    matchRepository = new MatchRepository();
  });

  describe('createMatch', () => {
    it('should call MatchRepository.createMatch()', async () => {
      await checkCalledWith(
        createMatch,
        [mockMatch],
        MatchRepository.prototype,
        'createMatch',
        testId,
        [mockMatch],
      );
    });
  });

  describe('findMatch', () => {
    it('should call MatchRepository.findMatch()', async () => {
      await checkCalledWith(
        findMatch,
        [testId],
        MatchRepository.prototype,
        'findMatch',
        mockMatch,
        [testId],
      );
    });
  });

  describe('findMatchesByPlayer', () => {
    it('should call MatchRepository.findMatchesByPlayer()', async () => {
      await checkCalledWith(
        findMatchesByPlayer,
        [player1],
        MatchRepository.prototype,
        'findMatchesByPlayer',
        [testId],
        [player1],
      );
    });
  });

  describe('updateMatch', () => {
    it('should call MatchRepository.updateMatch()', async () => {
      await checkCalledWith(
        updateMatch,
        [player1, mockUpdatedMatch],
        MatchRepository.prototype,
        'updateMatch',
        null,
        [player1, mockUpdatedMatch],
      );
    });
  });

  describe('deleteMatch', () => {
    it('should call MatchRepository.deleteMatch()', async () => {
      await checkCalledWith(deleteMatch, [testId], MatchRepository.prototype, 'deleteMatch', true, [
        testId,
      ]);
    });
  });
});
