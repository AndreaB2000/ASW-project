import { DBPlayer } from '../../src/repositories/player';
import { RatingFactory } from '../../src/models/Rating'
import { createPlayer, readAllPlayers, readPlayerByUsername, updatePlayerRating, deletePlayer } from '../../src/repositories/player';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { PlayerFactory } from '../../src/models/Player';
import { checkCalled, checkCalledWith } from '../test_utils/check-called';

describe('Player Repository', () => {
  const testValue = 1500;
  const testDeviation = 200;
  const testVolatility = 0.06;
  const testRating = RatingFactory.create(testValue, testDeviation, testVolatility);
  const testUsername = 'testUser';
  const testPlayer = PlayerFactory.create(testUsername, testRating);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlayer', () => {
    it('should call save on DB instance', async () => {
      await checkCalled(createPlayer, DBPlayer.prototype, 'save', null, [testPlayer]);
    });
  });

  describe('readAllPlayers', () => {
    it('should call find with correct parameters', async () => {
      const mockPlayers = [
        { username: 'user1', rating: { value: 1500, deviation: 200, volatility: 0.06 } },
        { username: 'user2', rating: { value: 1600, deviation: 190, volatility: 0.05 } }
      ];

      await checkCalledWith(readAllPlayers, [{}, 'username rating'], DBPlayer, 'find', mockPlayers, []);
    });
  });

  describe('readPlayerByUsername', () => {
    it('should call findOne with correct parameters', async () => {
      checkCalledWith(readPlayerByUsername, [ { username: testUsername } ], DBPlayer, 'findOne', testPlayer, [testUsername]);

      // const findOneSpy = jest.spyOn(DBPlayer, 'findOne');

      // const returnedPlayer = await readPlayerByUsername(testUsername);

      // expect(findOneSpy).toHaveBeenCalledWith({ username: testUsername });
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
