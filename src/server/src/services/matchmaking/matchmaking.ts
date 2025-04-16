import { getQueue } from '../../repositories/matchmakingQueue';

/**
 * Finds a suitable opponent for the requesting player
 * @param requestingPlayerUsername the id of the requesting player
 * @returns the username of the suitable opponent or null if none is found
 */
export const findSuitableOpponent = async (
  requestingPlayerUsername: string,
): Promise<string | null> => {
  const queue = await getQueue();
  const suitableOpponent = Array.from(queue).find(candidateOpponent =>
    opponentSelectionLogic(requestingPlayerUsername, candidateOpponent.username),
  );

  return suitableOpponent.username || null;
};

const opponentSelectionLogic = (candidate1: string, candidate2: string): boolean => {
  return true;
};
