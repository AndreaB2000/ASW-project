import { Match, MatchFactory } from '../models/Match';
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
  const match = MatchFactory.createWithDefaultInitialState(player1, player2, creationDate);
  // These lines are For debug purposes only. They create a match ready to be ended.
  // const match = MatchFactory.createWithCustomInitialState(
  //   player1,
  //   player2,
  //   creationDate,
  //   BoardFactory.createCustom(9, 9, [
  //     { x: 1, y: 1, pile: PileFactory.create(player1, 3) },
  //     { x: 1, y: 2, pile: PileFactory.create(player2, 3) },
  //   ]),
  // );
  return await inProgressMatchRepo.createMatch(match);
};

/**
 * Returns the match corresponding to the provided ID, searching in both
 * "in progress" and "ended" matches repositories.
 *
 * @param matchId the desired match ID
 * @returns the match corresponding to the provided ID
 */
export const getMatch = async (matchId: string): Promise<Match | null> => {
  let match =
    (await inProgressMatchRepo.findMatch(matchId)) ?? (await endedMatchRepo.findMatch(matchId));
  return match;
};

/**
 * Returns a list of matches played by the provided player, searching in both
 * "in progress" and "ended" matches repositories.
 *
 * @param player the player by which the matches are played.
 * @returns a list of matches played by the provided player.
 */
export const getEndedMatchesByPlayer = async (player: string): Promise<string[]> => {
  return await endedMatchRepo.findMatchesByPlayer(player);
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
    await inProgressMatchRepo.updateMatch(matchId, match);
  }

  return ret;
};

/**
 * Permanently saves a match in the ended match repository.
 *
 * Note: considering the current implementation of the two repositories,
 * the ID does not change.
 *
 * @param matchId the ID of the match to be saved permanently.
 * @param ratingDelta the absolute value of the rating score exchanged between players.
 * @returns the new ID of the permanently saved match.
 */
export const saveMatch = async (matchId: string, ratingDelta: number): Promise<string> => {
  const match: Match = await inProgressMatchRepo.findMatch(matchId);
  if (match == null) {
    return null;
  }
  match.ratingDelta = ratingDelta;
  await inProgressMatchRepo.deleteMatch(matchId);
  return await endedMatchRepo.createMatch(match, matchId);
};

/**
 * Deletes the match corresponding to the provided ID, searching in both
 * "in progress" and "ended" matches repositories.
 *
 * @param matchId the ID of the match to be deleted.
 * @returns true if the match has been deleted, false otherwise.
 */
export const deleteMatch = async (matchId: string): Promise<boolean> => {
  if (await inProgressMatchRepo.deleteMatch(matchId)) {
    return true;
  } else {
    return await endedMatchRepo.deleteMatch(matchId);
  }
};
