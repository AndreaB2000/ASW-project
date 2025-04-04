import { DBPlayer } from '../../src/repositories/player';
import { RatingFactory } from '../../src/models/Rating'
import { createPlayer, readAllPlayers, readPlayerByUsername, updatePlayerRating, deletePlayer } from '../../src/repositories/player';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';


describe('Player Repository', () => {
  const mockPlayer = {
    username: 'testUser',
    rating: {
      value: 1500,
      deviation: 200,
      volatility: 0.06,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlayer', () => {
    it('should create and save a player to the database', async () => {
      const saveMock = jest.fn();
      jest.spyOn(DBPlayer.prototype, 'save').mockImplementation(saveMock);

      await createPlayer(mockPlayer as any);

      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('readAllPlayers', () => {
    it('should return all players from the database', async () => {
      const mockDbPlayers = [
        {
          username: 'testUser1',
          rating: { value: 1500, deviation: 200, volatility: 0.06 },
        },
        {
          username: 'testUser2',
          rating: { value: 1600, deviation: 180, volatility: 0.05 },
        },
      ];
      jest.spyOn(DBPlayer, 'find').mockResolvedValue(mockDbPlayers);

      const players = await readAllPlayers();

      expect(players).toHaveLength(2);
      expect(players[0].username).toBe('testUser1');
      expect(players[1].username).toBe('testUser2');
    });
  });

  describe('readPlayerByUsername', () => {
    it('should return a player by username', async () => {
      const mockDbPlayer = {
        username: 'testUser',
        rating: { value: 1500, deviation: 200, volatility: 0.06 },
      };
      jest.spyOn(DBPlayer, 'findOne').mockResolvedValue(mockDbPlayer);

      const player = await readPlayerByUsername('testUser');

      expect(player).not.toBeNull();
      expect(player?.username).toBe('testUser');
    });

    it('should return null if player is not found', async () => {
      jest.spyOn(DBPlayer, 'findOne').mockResolvedValue(null);

      const player = await readPlayerByUsername('nonExistentUser');

      expect(player).toBeNull();
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
