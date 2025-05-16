import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DBMatch } from '../../src/repositories/match';
import { MatchRepository } from '../../src/repositories/match';
import * as matchFactory from '../../src/models/Match';
import { Match } from '../../src/models/Match';
import { checkCalled, checkCalledWith } from '../test_utils/check-called';
import mongoose from 'mongoose';

describe('Match Repository', () => {
  const PLAYER1 = 'Alice';
  const PLAYER2 = 'Bob';
  const PLAYER3 = 'Carl';
  const OTHER_PLAYER = 'otherplayer';
  const OTHER_ID = 'otherid';
  const NOW = new Date();
  const TEST_ID = '507f1f77bcf86cd799439011';
  const mockMatch: Match = matchFactory.createWithDefaultInitialState(PLAYER1, PLAYER2, NOW);
  const mockUpdatedMatch: Match = matchFactory.createWithDefaultInitialState(PLAYER3, PLAYER2, NOW);
  let matchRepository: MatchRepository = new MatchRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    matchRepository = new MatchRepository();
  });

  describe('createMatch', () => {
    it('should save a match in the database and return its match ID', async () => {
      const newMatchId = await checkCalled(
        matchRepository.createMatch,
        DBMatch.prototype,
        'save',
        { ...mockMatch, _id: TEST_ID },
        [mockMatch],
      );
      expect(newMatchId).toBe(TEST_ID);
    });
  });

  describe('findMatch', () => {
    it('should call the find function with the given match ID and return the corresponding match', async () => {
      const foundMatch = await checkCalledWith(
        matchRepository.findMatch,
        [TEST_ID],
        DBMatch,
        'findById',
        mockMatch,
        [TEST_ID],
      );
      expect(foundMatch).toStrictEqual(mockMatch);
    });

    it('should return null if a match with the given ID does not exist', async () => {
      const foundMatch = await checkCalledWith(
        matchRepository.findMatch,
        [TEST_ID],
        DBMatch,
        'findById',
        null,
        [TEST_ID],
      );
      expect(foundMatch).toBe(null);
    });
  });

  describe('findMatchesByPlayer', () => {
    it('should call the find function with the given player and return the corresponding matches list', async () => {
      const foundMatch = await checkCalledWith(
        matchRepository.findMatchesByPlayer,
        [{ $or: [{ player1: PLAYER2 }, { player2: PLAYER2 }] }],
        DBMatch,
        'find',
        [
          { _id: TEST_ID, ...mockMatch },
          { _id: OTHER_ID, ...mockUpdatedMatch },
        ],
        [PLAYER2],
      );
      expect(foundMatch).toEqual([TEST_ID, OTHER_ID]);
    });

    it('should return null if there are no matches played by the given player', async () => {
      const foundMatch = await checkCalledWith(
        matchRepository.findMatchesByPlayer,
        [{ $or: [{ player1: OTHER_PLAYER }, { player2: OTHER_PLAYER }] }],
        DBMatch,
        'find',
        [],
        [OTHER_PLAYER],
      );
      expect(foundMatch).toEqual([]);
    });
  });

  describe('updateMatch', () => {
    it('should call the model update function with the correct parameters', async () => {
      await checkCalledWith(
        matchRepository.updateMatch,
        [{ _id: new mongoose.Types.ObjectId(TEST_ID) }, mockUpdatedMatch],
        DBMatch,
        'findOneAndUpdate',
        [],
        [TEST_ID, mockUpdatedMatch],
      );
    });
  });

  describe('deleteMatch', () => {
    it('should call the model delete function with the correct parameters', async () => {
      await checkCalledWith(
        matchRepository.deleteMatch,
        [{ matchId: TEST_ID }],
        DBMatch,
        'deleteOne',
        {
          acknowledged: true,
          deletedCount: 1,
        },
        [TEST_ID],
      );
    });

    it('should return true if the given ID exists', async () => {
      const deleted = await checkCalledWith(
        matchRepository.deleteMatch,
        [{ matchId: TEST_ID }],
        DBMatch,
        'deleteOne',
        {
          acknowledged: true,
          deletedCount: 1,
        },
        [TEST_ID],
      );
      expect(deleted).toBe(true);
    });

    it('should return false if the given ID does not exist', async () => {
      const deleted = await checkCalledWith(
        matchRepository.deleteMatch,
        [{ matchId: OTHER_ID }],
        DBMatch,
        'deleteOne',
        {
          acknowledged: true,
          deletedCount: 0,
        },
        [OTHER_ID],
      );
      expect(deleted).toBe(false);
    });
  });
});
