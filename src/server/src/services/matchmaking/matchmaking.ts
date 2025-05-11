import { getQueue, addCandidate, removeCandidate } from '../../repositories/matchmakingQueue';
import { isValidMatch } from './opponentSelectionLogic';
import { MatchmakingCandidate, MatchmakingCandidateFactory } from '../../models/MatchmakingCandidate';
import '../../utils/array.extensions';
import { readPlayerByUsername } from '../../repositories/player';

/**
 * Finds a suitable opponent for the requesting player
 * @param requestingPlayerUsername the id of the requesting player
 * @returns the username of the suitable opponent, or undefined if no suitable opponent is found
 */
export const findSuitableOpponent = async (
  requestingPlayerUsername: MatchmakingCandidate,
): Promise<string | undefined> => {
  const queue = await getQueue();
  const suitableOpponent = await Array.from(queue).findAsync(
    async candidateOpponent =>
      await isValidMatch(requestingPlayerUsername, candidateOpponent),
  );

  return suitableOpponent?.username;
};

/**
 * Finds a suitable opponent for the given player. If no opponent is found, adds the player to the matchmaking queue.
 * @param username The username of the player.
 * @returns The username of the suitable opponent, or undefined if the player was added to the queue.
 */
export const findMatchOrQueue = async (username: string): Promise<string | undefined> => {
  const requestingPlayer = await readPlayerByUsername(username);
  const requestingCandidate = MatchmakingCandidateFactory.create(
    username,
    requestingPlayer.rating,
    new Date(),
  );

  const suitableOpponent = await findSuitableOpponent(requestingCandidate);

  if (suitableOpponent) {
    removeCandidate(suitableOpponent);
    return suitableOpponent;
  }

  await addCandidate(requestingCandidate);

  return undefined;
};
