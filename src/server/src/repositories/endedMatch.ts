import { Match } from '../models/Match';
import { MatchRepository } from './match';

const repo = new MatchRepository();

/**
 * Saves a given match in the database.
 *
 * @param match the match object to be saved.
 * @returns the ID of the saved match.
 */
export const createMatch = async (match: Match, matchId?: string): Promise<string> =>
  await repo.createMatch(match, matchId);

/**
 * Returns the match corresponding to the provided ID, if it exists.
 *
 * @param matchId the desired match ID.
 * @returns the match corresponding to the provided ID, or null if the ID does not exist.
 */
export const findMatch = async (matchId: string): Promise<Match | null> =>
  await repo.findMatch(matchId);

/**
 * Returns a list of matches played by the provided player.
 *
 * @param player the player by which the matches are played.
 * @returns a list of matches played by the provided player.
 */
export const findMatchesByPlayer = async (player: string): Promise<string[]> =>
  await repo.findMatchesByPlayer(player);

// Maybe it can return a boolean representing the effectiveness of the update?
/**
 * Updates the match corresponding to the provided ID.
 *
 * @param matchId the ID of the match to be updated.
 * @param newMatch the updated match object.
 */
export const updateMatch = async (matchId: string, newMatch: Match): Promise<void> =>
  await repo.updateMatch(matchId, newMatch);

/**
 * Deletes the match corresponding to the provided ID.
 *
 * @param matchId the ID of the match to be deleted.
 * @returns true if the match has been deleted, false otherwise.
 */
export const deleteMatch = async (matchId: string): Promise<boolean> =>
  await repo.deleteMatch(matchId);
