import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DBMatch } from '../../src/repositories/match';
import { MatchRepository } from '../../src/repositories/match';
import { Match, MatchFactory } from '../../src/models/Match';
import { checkCalled, checkCalledWith } from '../test_utils/check-called';
import mongoose from 'mongoose';

describe('Match Repository', () => {
  const PLAYER1 = 'Alice';
  const PLAYER2 = 'Bob';
  const PLAYER3 = 'Carl';
  const OTHER_PLAYER = 'otherplayer';
  const OTHER_ID = '507f1f77bcf86cd79943901a';
  const NOW = new Date();
  const testId = '507f1f77bcf86cd799439011';
  const invalidId = 'invalid';
  const mockMatch: Match = MatchFactory.createWithDefaultInitialState(PLAYER1, PLAYER2, NOW);
  const mockUpdatedMatch: Match = MatchFactory.createWithDefaultInitialState(PLAYER3, PLAYER2, NOW);
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
        { ...mockMatch, _id: testId },
        [mockMatch],
      );
      expect(newMatchId).toBe(testId);
    });

    it('should save a match in the database with the given match ID if it is passed', async () => {
      const newMatchId = await checkCalled(
        matchRepository.createMatch,
        DBMatch.prototype,
        'save',
        { ...mockMatch, _id: testId },
        [mockMatch, testId],
      );
      expect(newMatchId).toBe(testId);
    });
  });

  describe('findMatch', () => {
    it('should call the find function with the given match ID and return the corresponding match', async () => {
      const foundMatch = await checkCalledWith(
        matchRepository.findMatch,
        [testId],
        DBMatch,
        'findById',
        mockMatch,
        [testId],
      );
      expect(foundMatch).toStrictEqual(mockMatch);
    });

    it('should return null if a match with the given ID does not exist', async () => {
      const foundMatch = await checkCalledWith(
        matchRepository.findMatch,
        [testId],
        DBMatch,
        'findById',
        null,
        [testId],
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
          { _id: testId, ...mockMatch },
          { _id: OTHER_ID, ...mockUpdatedMatch },
        ],
        [PLAYER2],
      );
      expect(foundMatch).toEqual([testId, OTHER_ID]);
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
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockImplementation(() => true);
      const spyFindUpdate = jest
        .spyOn(DBMatch, 'findOneAndUpdate')
        .mockResolvedValue(mockUpdatedMatch);

      matchRepository.updateMatch(testId, mockUpdatedMatch);

      expect(spyFindUpdate).toHaveBeenCalledWith(
        { _id: testId },
        { $set: mockUpdatedMatch },
        {
          new: true,
          upsert: false,
          runValidators: true,
        },
      );
    });

    it('should return an error if the provided ID is not vaild', () => {
      const spyIsValid = jest
        .spyOn(mongoose.Types.ObjectId, 'isValid')
        .mockImplementation(() => false);
      const spyFindUpdate = jest
        .spyOn(DBMatch, 'findOneAndUpdate')
        .mockResolvedValue(mockUpdatedMatch);

      expect(matchRepository.updateMatch(invalidId, mockUpdatedMatch)).rejects.toThrow(
        `Invalid matchId: ${invalidId}`,
      );
      expect(spyIsValid).toHaveBeenCalledWith(invalidId);
      expect(spyFindUpdate).not.toHaveBeenCalled();
    });

    it('should return an error if the update operation was not successful', () => {
      const spyIsValid = jest
        .spyOn(mongoose.Types.ObjectId, 'isValid')
        .mockImplementation(() => true);
      const spyFindUpdate = jest.spyOn(DBMatch, 'findOneAndUpdate').mockResolvedValue(undefined);

      expect(matchRepository.updateMatch(testId, mockUpdatedMatch)).rejects.toThrow(
        `Match ${testId} not found or update failed`,
      );
      expect(spyIsValid).toHaveBeenCalledWith(testId);
      expect(spyFindUpdate).toHaveBeenCalledWith(
        { _id: testId },
        { $set: mockUpdatedMatch },
        {
          new: true,
          upsert: false,
          runValidators: true,
        },
      );
    });
  });

  describe('deleteMatch', () => {
    it('should call the model delete function with the correct parameters', async () => {
      await checkCalledWith(
        matchRepository.deleteMatch,
        [{ _id: new mongoose.Types.ObjectId(testId) }],
        DBMatch,
        'deleteOne',
        {
          acknowledged: true,
          deletedCount: 1,
        },
        [testId],
      );
    });

    it('should return true if the given ID exists', async () => {
      const deleted = await checkCalledWith(
        matchRepository.deleteMatch,
        [{ _id: new mongoose.Types.ObjectId(testId) }],
        DBMatch,
        'deleteOne',
        {
          acknowledged: true,
          deletedCount: 1,
        },
        [testId],
      );
      expect(deleted).toBe(true);
    });

    it('should return false if the given ID does not exist', async () => {
      const deleted = await checkCalledWith(
        matchRepository.deleteMatch,
        [{ _id: new mongoose.Types.ObjectId(OTHER_ID) }],
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
