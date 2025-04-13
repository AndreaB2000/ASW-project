import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  createMatch,
  DBMatch,
  deleteMatch,
  findMatch,
  findMatchesByPlayer,
  updateMatch,
} from '../../src/repositories/endedMatch';
import * as matchFactory from '../../src/models/Match';
import { Match } from '../../src/models/Match';
import { checkCalled, checkCalledWith } from '../test_utils/check-called';

describe('Match Repository', () => {
  const PLAYER1 = 'Alice';
  const PLAYER2 = 'Bob';
  const PLAYER3 = 'Carl';
  const OTHER_PLAYER = 'otherplayer';
  const OTHER_ID = 'otherid';
  const NOW = new Date();
  const TEST_ID = 'testid';
  const mockMatch: Match = matchFactory.create(PLAYER1, PLAYER2, NOW);
  const mockUpdatedMatch: Match = matchFactory.create(PLAYER3, PLAYER2, NOW);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMatch', () => {
    it('should save a match in the database and return its match ID', async () => {
      const newMatchId = await checkCalled(
        createMatch,
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
        findMatch,
        [TEST_ID],
        DBMatch,
        'findById',
        mockMatch,
        [TEST_ID],
      );
      expect(foundMatch).toBe(mockMatch);
    });

    it('should return null if a match with the given ID does not exist', async () => {
      const foundMatch = await checkCalledWith(findMatch, [TEST_ID], DBMatch, 'findById', null, [
        TEST_ID,
      ]);
      expect(foundMatch).toBe(null);
    });
  });

  describe('findMatchesByPlayer', () => {
    it('should call the find function with the given player and return the corresponding matches list', async () => {
      const foundMatch = await checkCalledWith(
        findMatchesByPlayer,
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
        findMatchesByPlayer,
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
        updateMatch,
        [{ matchId: TEST_ID }, mockUpdatedMatch],
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
        deleteMatch,
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
        deleteMatch,
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
        deleteMatch,
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
