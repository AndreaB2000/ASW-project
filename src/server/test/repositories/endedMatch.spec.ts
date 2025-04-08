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

describe('Match Repository', () => {
  const PLAYER1 = 'Alice';
  const PLAYER2 = 'Bob';
  const PLAYER3 = 'Carl';
  const NOW = new Date();
  //const TEST_ID = new mongoose.Types.ObjectId().toString();
  const TEST_ID = 'testid';
  const mockMatch: Match = matchFactory.create(PLAYER1, PLAYER2, NOW);
  const mockUpdatedMatch: Match = matchFactory.create(PLAYER3, PLAYER2, NOW);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMatch', () => {
    it('should save a match in the database and return its match ID', async () => {
      const saveMock = jest.fn().mockReturnValue({ ...mockMatch, _id: TEST_ID });
      jest.spyOn(DBMatch.prototype, 'save').mockImplementation(saveMock);

      const newMatchId = await createMatch(mockMatch as any);

      expect(saveMock).toHaveBeenCalled();
      expect(newMatchId).toBe(TEST_ID);
    });
  });

  describe('findMatch', () => {
    it('should call the find function with the given match ID and return the corresponding match', async () => {
      const findByIdMock = jest.fn(() =>
        Promise.resolve(mockMatch),
      ) as unknown as jest.MockedFunction<typeof DBMatch.findById>;
      jest.spyOn(DBMatch, 'findById').mockImplementation(findByIdMock);

      const foundMatch = await findMatch(TEST_ID);

      expect(findByIdMock).toHaveBeenCalledWith(TEST_ID);
      expect(foundMatch).toBe(mockMatch);
    });

    it('should return null if a match with the given ID does not exist', async () => {
      const findByIdMock = jest.fn(() => Promise.resolve(null)) as unknown as jest.MockedFunction<
        typeof DBMatch.findById
      >;
      jest.spyOn(DBMatch, 'findById').mockImplementation(findByIdMock);

      const foundMatch = await findMatch('otherid');

      expect(foundMatch).toBe(null);
    });
  });

  describe('findMatchesByPlayer', () => {
    it('should call the find function with the given player and return the corresponding matches list', async () => {
      const findMock = jest.fn(() =>
        Promise.resolve([mockMatch, mockUpdatedMatch]),
      ) as unknown as jest.MockedFunction<typeof DBMatch.find>;
      jest.spyOn(DBMatch, 'find').mockImplementation(findMock);

      const foundMatch = await findMatchesByPlayer(PLAYER2);

      expect(findMock).toHaveBeenCalledWith({
        $or: [{ player1: PLAYER2 }, { player2: PLAYER2 }],
      });
      expect(foundMatch).toEqual([mockMatch, mockUpdatedMatch]);
    });

    it('should return null if there are no matches played by the given player', async () => {
      const findMock = jest.fn(() =>
        Promise.resolve([mockMatch, mockUpdatedMatch]),
      ) as unknown as jest.MockedFunction<typeof DBMatch.find>;
      jest.spyOn(DBMatch, 'find').mockImplementation(findMock);

      const foundMatch = await findMatchesByPlayer('otherplayer');

      expect(foundMatch).toEqual([mockMatch, mockUpdatedMatch]);
    });
  });

  describe('updateMatch', () => {
    it('should call the model update function with the correct parameters', async () => {
      const findOneAndUpdateMock = jest.fn(() =>
        Promise.resolve(),
      ) as unknown as jest.MockedFunction<typeof DBMatch.findOneAndUpdate>;
      jest.spyOn(DBMatch, 'findOneAndUpdate').mockImplementation(findOneAndUpdateMock);

      await updateMatch(TEST_ID, mockUpdatedMatch);

      expect(findOneAndUpdateMock).toHaveBeenCalledWith({ matchId: TEST_ID }, mockUpdatedMatch);
    });
  });

  describe('deleteMatch', () => {
    it('should call the model delete function with the correct parameters', async () => {
      const deleteOneMock = jest.fn(() =>
        Promise.resolve({ acknowledged: true, deletedCount: 1 }),
      ) as unknown as jest.MockedFunction<typeof DBMatch.deleteOne>;
      jest.spyOn(DBMatch, 'deleteOne').mockImplementation(deleteOneMock);

      const deleted = await deleteMatch(TEST_ID);

      expect(deleteOneMock).toHaveBeenCalledWith({ matchId: TEST_ID });
    });

    it('should return true if the given ID exists', async () => {
      const deleteOneMock = jest.fn(() =>
        Promise.resolve({ acknowledged: true, deletedCount: 1 }),
      ) as unknown as jest.MockedFunction<typeof DBMatch.deleteOne>;
      jest.spyOn(DBMatch, 'deleteOne').mockImplementation(deleteOneMock);

      const deleted = await deleteMatch(TEST_ID);

      expect(deleted).toBe(true);
    });

    it('should return false if the given ID does not exist', async () => {
      const deleteOneMock = jest.fn(() =>
        Promise.resolve({ acknowledged: true, deletedCount: 0 }),
      ) as unknown as jest.MockedFunction<typeof DBMatch.deleteOne>;
      jest.spyOn(DBMatch, 'deleteOne').mockImplementation(deleteOneMock);

      const deleted = await deleteMatch('otherid');

      expect(deleted).toBe(false);
    });
  });
});
