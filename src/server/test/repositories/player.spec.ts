import { DBPlayer } from '../../src/repositories/player';
import { RatingFactory } from '../../src/models/Rating'
import { createPlayer, readAllPlayers, readPlayerByUsername, updatePlayerRating, deletePlayer } from '../../src/repositories/player';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { PlayerFactory } from '../../src/models/Player';

async function checkCalledWith(testedMethod: Function, expectedWith: any, spiedClass: any, spiedFunction: string, ...args: any) {
  const mockFun = jest.fn();
  jest.spyOn(spiedClass, spiedFunction).mockImplementation(mockFun);

  console.log('args', args);
  await testedMethod(...args);

  expect(mockFun).toHaveBeenCalledWith(expectedWith);
}

async function checkCalled(testedMethod: Function, spiedClass: any, spiedFunction: string, ...args: any) {
  const mockFun = jest.fn();
  jest.spyOn(spiedClass, spiedFunction).mockImplementation(mockFun);

  console.log('args', args);
  await testedMethod(...args);

  expect(mockFun).toHaveBeenCalled();
}

describe('Player Repository', () => {
  const value = 1500;
  const deviation = 200;
  const volatility = 0.06;
  const rating = RatingFactory.create(value, deviation, volatility);
  const username = 'testUser';
  const player = PlayerFactory.create(username, rating);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlayer', () => {
    it('should call save on DB instance', async () => {
      
      await checkCalled(createPlayer, DBPlayer.prototype, 'save', player);

    });
  });

  describe('readAllPlayers', () => {
    it('should call find with correct parameters', async () => {
      await checkCalledWith(readAllPlayers, [{}, 'username rating'], DBPlayer, 'find');
    });
  });

  describe('readPlayerByUsername', () => {
    it('should call findOne with correct parameters', async () => {
      const findOneSpy = jest.spyOn(DBPlayer, 'findOne');

      const returnedPlayer = await readPlayerByUsername(username);

      expect(findOneSpy).toHaveBeenCalledWith({ username });
    });
  });

  describe('updatePlayerRating', () => {
    it("should update a player's rating", async () => {
      const newRating = RatingFactory.create(1600, 190, 0.05);
  
      jest.spyOn(DBPlayer, 'findOneAndUpdate').mockResolvedValue({ username: 'testUser', rating: newRating });
  
      await updatePlayerRating('testUser', newRating);
  
      expect(DBPlayer.findOneAndUpdate).toHaveBeenCalledWith(
        { username: 'testUser' },
        { $set: { rating: { value: newRating.value, deviation: newRating.deviation, volatility: newRating.volatility } } },
        { new: true }
      );
    });
  });

  describe('deletePlayer', () => {
    it('should delete a player by username', async () => {
      jest.spyOn(DBPlayer, 'deleteOne').mockResolvedValue({ acknowledged: true, deletedCount: 1 });

      const result = await deletePlayer('testUser');

      expect(result).toBe(true);
    });

    it('should return false if no player was deleted', async () => {
      jest.spyOn(DBPlayer, 'deleteOne').mockResolvedValue({ acknowledged: true, deletedCount: 0 });

      const result = await deletePlayer('nonExistentUser');

      expect(result).toBe(false);
    });
  });
});
