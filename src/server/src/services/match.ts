import * as matchFactory from '../models/Match';
import { Match } from '../models/Match';
import { Move } from '../models/Move';
import * as endedMatchRepo from '../repositories/endedMatch';
import * as inProgressMatchRepo from '../repositories/inProgressMatch';

/**
 * Creates a new match and returns its ID.
 *
 * @param player1 the first player.
 * @param player2 the second player.
 * @param creationDate the match creation date.
 * @returns the ID of the just created match.
 */
export const newMatch = async (
  player1: string,
  player2: string,
  creationDate: Date,
): Promise<string> => {
  const match = matchFactory.createWithDefaultInitialState(player1, player2, creationDate);
  return inProgressMatchRepo.createMatch(match);
};

/**
 * Returns the match corresponding to the provided ID, searching in both
 * "in progress" and "ended" matches repositories.
 *
 * @param matchId the desired match ID
 * @returns the match corresponding to the provided ID
 */
export const getMatch = async (matchId: string): Promise<Match | null> => {
  return inProgressMatchRepo.findMatch(matchId) ?? endedMatchRepo.findMatch(matchId);
};

/**
 * Returns a list of matches played by the provided player, searching in both
 * "in progress" and "ended" matches repositories.
 *
 * @param player the player by which the matches are played.
 * @returns a list of matches played by the provided player.
 */
export const getMatchesByPlayer = async (player: string): Promise<string[]> => {
  return [
    ...(await inProgressMatchRepo.findMatchesByPlayer(player)),
    ...(await endedMatchRepo.findMatchesByPlayer(player)),
  ];
};

/**
 * Adds a move to the match corresponding to the provided ID, if it is valid.
 *
 * @param matchId the ID of the match in which the move has to be added.
 * @param movingPlayer the player who is making the move.
 * @param newMove the move to be added.
 * @returns true if the move has been successfully added, false otherwise.
 */
export const addMove = async (
  matchId: string,
  movingPlayer: string,
  newMove: Move,
): Promise<boolean> => {
  let match = await inProgressMatchRepo.findMatch(matchId);

  if (match == null) {
    return false;
  }

  let ret: boolean = false;
  if (
    (movingPlayer == match.player1 && match.moves.length % 2 == 0) ||
    (movingPlayer == match.player2 && match.moves.length % 2 == 1)
  ) {
    ret = match.addMove(newMove);
    inProgressMatchRepo.updateMatch(matchId, match);
  }

  return ret;
};

/**
 * Deletes the match corresponding to the provided ID, searching in both
 * "in progress" and "ended" matches repositories.
 *
 * @param matchId the ID of the match to be deleted.
 * @returns true if the match has been deleted, false otherwise.
 */
export const deleteMatch = async (matchId: string): Promise<boolean> => {
  if (inProgressMatchRepo.deleteMatch(matchId)) {
    return true;
  } else {
    return endedMatchRepo.deleteMatch(matchId);
  }
};
