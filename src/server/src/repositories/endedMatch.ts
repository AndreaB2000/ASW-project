import mongoose from 'mongoose';
import { Match } from '../models/Match';

/**
 * Saves a given match in the database.
 *
 * @param match the match object to be saved.
 * @returns the ID of the saved match.
 */
export const createMatch = async (match: Match): Promise<string> => {
  const dbmatch = new DBMatch({
    player1: match.player1,
    player2: match.player2,
    creationDate: match.creationDate,
    moves: [],
  });
  return (await dbmatch.save())._id.toString();
};

/**
 * Returns the match corresponding to the provided ID, if it exists.
 *
 * @param matchId the desired match ID.
 * @returns the match corresponding to the provided ID, or null if the ID does not exist.
 */
export const findMatch = async (matchId: string): Promise<Match | null> => {
  return await DBMatch.findById(matchId);
};

/**
 * Returns a list of matches played by the provided player.
 *
 * @param player the player by which the matches are played.
 * @returns a list of matches played by the provided player.
 */
export const findMatchesByPlayer = async (player: string): Promise<string[]> => {
  const matches = await DBMatch.find({
    $or: [{ player1: player }, { player2: player }],
  });
  return matches.map(match => match._id.toString());
};

// Maybe it can return a boolean representing the effectiveness of the update?
/**
 * Updates the match corresponding to the provided ID.
 *
 * @param matchId the ID of the match to be updated.
 * @param newMatch the updated match object.
 */
export const updateMatch = async (matchId: string, newMatch: Match): Promise<void> => {
  await DBMatch.findOneAndUpdate({ matchId }, newMatch);
};

/**
 * Deletes the match corresponding to the provided ID.
 *
 * @param matchId the ID of the match to be deleted.
 * @returns true if the match has been deleted, false otherwise.
 */
export const deleteMatch = async (matchId: string): Promise<boolean> => {
  return (await DBMatch.deleteOne({ matchId })).deletedCount > 0;
};

const matchSchema = new mongoose.Schema({
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  creationDate: { type: Date, required: true, default: Date.now },
  moves: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  ],
});

export const DBMatch = mongoose.model<Match>('Match', matchSchema);
