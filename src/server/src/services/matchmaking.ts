import { MatchmakingCandidate, MatchmakingCandidateFactory } from '../models/MatchmakingCandidate';
import { getQueue } from '../repositories/matchmakingQueue';
import { readPlayerByUsername } from '../repositories/player';

/**
 * finds a suitable opponent for the requesting player
 * @param requestingPlayerUsername the id of the requesting player
 * @returns the username of the suitable opponent or null if none is found
 */
export const findSuitableOpponent = async (
  requestingPlayerUsername: string,
): Promise<string | null> => {
  const requestingPlayerData = await readPlayerByUsername(requestingPlayerUsername);
  const requestingPlayerRating = requestingPlayerData.rating.value;

  const requestingPlayer = MatchmakingCandidateFactory.create(
    requestingPlayerUsername,
    requestingPlayerRating,
    new Date(),
  );

  const queue = await getQueue();
  const suitableOpponent = Array.from(queue).find(
    (candidate) => opponentSelectionLogic(requestingPlayer, candidate)
  );

  return suitableOpponent.playerId || null;
}

const opponentSelectionLogic = (candidate1: MatchmakingCandidate, candidate2: MatchmakingCandidate): boolean => {
  return true;
}