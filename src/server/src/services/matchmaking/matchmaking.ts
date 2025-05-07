import { getQueue, addCandidate } from '../../repositories/matchmakingQueue';
import { evaluateOpponentMatch } from './opponentSelectionLogic';
import { MatchmakingCandidateFactory } from '../../models/MatchmakingCandidate';
import '../../utils/array.extensions';

/**
 * Finds a suitable opponent for the requesting player
 * @param requestingPlayerUsername the id of the requesting player
 * @returns the username of the suitable opponent or null if none is found
 */
export const findSuitableOpponent = async (
  requestingPlayerUsername: string,
): Promise<string | undefined> => {
  const today = new Date();
  const queue = await getQueue();
  const suitableOpponent = await Array.from(queue).findAsync(async candidateOpponent =>
    await evaluateOpponentMatch(
      requestingPlayerUsername,
      today,
      candidateOpponent.username,
      candidateOpponent.requestTime,
    ),
  );

  return suitableOpponent?.username;
};

/**
 * Finds a suitable opponent for the given player. If no opponent is found, adds the player to the matchmaking queue.
 * @param username The username of the player.
 * @returns The username of the suitable opponent, or undefined if the player was added to the queue.
 */
export const findMatchOrQueue = async (username: string): Promise<string | undefined> => {
  const suitableOpponent = await findSuitableOpponent(username);

  if (suitableOpponent) {
    return suitableOpponent;
  }

  const candidate = MatchmakingCandidateFactory.create(username, new Date());
  await addCandidate(candidate);

  return undefined;
};
