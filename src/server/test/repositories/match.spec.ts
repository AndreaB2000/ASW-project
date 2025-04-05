import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createMatch, DBMatch, findMatch } from '../../src/repositories/match';
import * as matchFactory from '../../src/models/Match';
import { Match } from '../../src/models/Match';

describe('Match Repository', () => {
  const PLAYER1 = 'Alice';
  const PLAYER2 = 'Bob';
  const NOW = new Date();
  //const TEST_ID = new mongoose.Types.ObjectId().toString();
  const TEST_ID = 'testid';
  const mockMatch: Match = matchFactory.create(PLAYER1, PLAYER2, NOW);

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
});
