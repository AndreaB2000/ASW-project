import { getQueue } from '../../repositories/matchmakingQueue';
import { evaluateOpponentMatch } from './opponentSelectionLogic';
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
  const suitableOpponent = await Array.from(queue).findAsync(candidateOpponent =>
    evaluateOpponentMatch(requestingPlayerUsername, today, candidateOpponent.username, candidateOpponent.requestTime),
  );

  return suitableOpponent?.username;
};
