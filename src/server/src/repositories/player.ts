import mongoose from 'mongoose';
import { Player, PlayerFactory } from '../models/Player';
import { Rating, RatingFactory } from '../models/Rating';

/**
 * Stores player information.
 */
export const createPlayer = async (player: Player): Promise<void> => {
  const dbPlayer = new DBPlayer({
    username: player.username,
    rating: {
      value: player.rating.value,
    },
  });
  await dbPlayer.save();
};

/**
 * Reads all players from the database.
 * @returns { Player[] } - List of all players
 */
export const readAllPlayers = async (): Promise<Player[]> => {
  const players = await DBPlayer.find({}, 'username rating');
  return players.map(player =>
    PlayerFactory.create(
      player.username,
      RatingFactory.create(player.rating.value),
    ),
  );
};

/**
 * Finds a player by username.
 * @param username - The username of the player to find.
 * @returns {Promise<Player | null>} - The found player or null.
 */
export const readPlayerByUsername = async (username: string): Promise<Player | null> => {
  const player = await DBPlayer.findOne({ username });
  return player
    ? PlayerFactory.create(
        player.username,
        RatingFactory.create(
          player.rating.value,
        ),
      )
    : null;
};

/**
 * Updates a player's rating.
 * @param username - The username of the player.
 * @param rating - The new rating.
 * @returns {Promise<void>}
 */
export const updatePlayerRating = async (username: string, rating: Rating): Promise<void> => {
  await DBPlayer.findOneAndUpdate(
    { username },
    {
      $set: {
        rating: { value: rating.value},
      },
    },
    { new: true },
  );
};

/**
 * Deletes a player by username.
 * @param username - The username of the player to delete.
 * @returns {Promise<boolean>} - True if deleted, false otherwise.
 */
export const deletePlayer = async (username: string): Promise<boolean> => {
  const result = await DBPlayer.deleteOne({ username });
  return result.deletedCount > 0;
};

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  rating: {
    value: { type: Number, required: true },
  },
});

export const DBPlayer = mongoose.model('Player', playerSchema);
