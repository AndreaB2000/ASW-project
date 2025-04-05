import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createMatch, DBMatch, findMatch } from '../../src/repositories/match';
import mongoose from 'mongoose';
import * as matchFactory from '../../src/models/Match';
import { Match } from '../../src/models/Match';
import { Move } from '../../src/models/Move';

describe('Match Repository', () => {
  const PLAYER1 = 'Alice';
  const PLAYER2 = 'Bob';
  const NOW = new Date();
  //const TEST_ID = new mongoose.Types.ObjectId().toString();
  const TEST_ID = 'testid';
  const mockMatch = {
    player1: PLAYER1,
    player2: PLAYER2,
    creationDate: new Date(),
    moves: [] as Move[],
    _id: TEST_ID,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMatch', () => {
    it('should save a match in the database', async () => {
      const saveMock = jest.fn();
      jest.spyOn(DBMatch.prototype, 'save').mockImplementation(saveMock);
      saveMock.mockReturnValue(mockMatch);

      await createMatch(mockMatch as any);

      expect(saveMock).toHaveBeenCalled();
    });

    it('should return the new match ID', async () => {
      const saveMock = jest.fn();
      saveMock.mockReturnValue(mockMatch);

      const newMatchId = await createMatch(mockMatch as any);

      expect(newMatchId).toBe(TEST_ID);
    });
  });

  /* describe('findMatch', () => {
    it('should call the find function with the given match ID', async () => {
      const findByIdMock = jest.fn();
      jest.spyOn(DBMatch.prototype, 'findById').mockImplementation(findByIdMock);

      await findMatch(TEST_ID);

      expect(findByIdMock).toHaveBeenCalledWith(TEST_ID);
    });
  });

  it('should initialize moves as empty array', async () => {
    const mockSavedDoc = { ...testMatch,
      _id: TEST_ID,
      moves: [],
      save: mockSave,
    };

    mockSave.mockReturnValue(mockSavedDoc);

    await createMatch(testMatch);

    // Verifica che venga creato con moves vuoto
    const constructorCall = (mongoose.model as jest.Mock).mock.results[0].value;
    const instance = new constructorCall(testMatch);
    expect(instance.moves).toEqual([]);
  });

  describe('findMatch', () => {
    it('should find a match by id', async () => {
      const mockFoundDoc = {
        ...testMatch,
        _id: TEST_ID,
        toObject: () => ({ ...testMatch, _id: TEST_ID }),
      };

      mockFindById.mockResolvedValue(mockFoundDoc);

      const result = await findMatch(TEST_ID);

      expect(mockFindById).toHaveBeenCalledWith(TEST_ID);
      expect(result).toEqual({ ...testMatch, _id: TEST_ID });
    });
  }); */

  /* describe('findMatch', () => {
    it('should find a match by id', async () => {
      const mockId = new mongoose.Types.ObjectId();
      const mockMatch = {
        _id: mockId,
        player1: 'player1',
        player2: 'player2',
        creationDate: new Date(),
        moves: [],
      };

      mockFindById.mockResolvedValue(mockMatch);

      const result = await findMatch(mockId.toString());

      expect(mockFindById).toHaveBeenCalledWith(mockId.toString());
      expect(result).toEqual(mockMatch);
    });

    it('should return null when match is not found', async () => {
      const mockId = new mongoose.Types.ObjectId();
      mockFindById.mockResolvedValue(null);

      const result = await findMatch(mockId.toString());

      expect(result).toBeNull();
    });

    it('should throw an error when find fails', async () => {
      const mockId = new mongoose.Types.ObjectId();
      mockFindById.mockRejectedValue(new Error('Find failed'));

      await expect(findMatch(mockId.toString())).rejects.toThrow('Find failed');
    });
  }); */
});
