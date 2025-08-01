import { getQueue, addCandidate, removeCandidate } from '../../repositories/matchmakingQueue';
import { isValidMatch } from './logic';
import {
  MatchmakingCandidate,
  MatchmakingCandidateFactory,
} from '../../models/MatchmakingCandidate';
import '../../utils/array.extensions';
import { newMatch } from '../match';
import { readAccountByUsername } from '../../repositories/account';

/**
 * Creates a new match if possible for the given player.
 * If no match is found, the player will be added to the matchmaking queue.
 * If no player is given, it will try to find a match for any player in the queue.
 * @param requestingUsername The username of the player.
 * @returns An object containing the usernames of the matched players and the match ID, or undefined if no match was found.
 */
export const findMatch = async (
  requestingUsername?: string,
): Promise<[string, string, string] | undefined> => {
  if (!requestingUsername) return await findMatchAndCreate();
  else return await findMatchOrQueue(requestingUsername);
};

/**
 * Finds a suitable opponent for the given player. If no opponent is found, adds the player to the matchmaking queue.
 * @param requestingUsername The username of the player.
 * @returns An object containing the usernames of the matched players and the match ID, or undefined if no match was found.
 */
export const findMatchOrQueue = async (
  requestingUsername: string,
): Promise<[string, string, string] | undefined> => {
  const requestingPlayer = await readAccountByUsername(requestingUsername);
  const requestingCandidate = MatchmakingCandidateFactory.create(
    requestingUsername,
    requestingPlayer.rating,
  );

  const suitableOpponent = await findSuitableOpponent(requestingCandidate);

  if (suitableOpponent) {
    await removeCandidate(suitableOpponent);
    const matchId = await newMatch(requestingUsername, suitableOpponent.username, new Date());
    return [requestingUsername, suitableOpponent.username, matchId];
  }

  await addCandidate(requestingCandidate);

  return undefined;
};

/**
 * Finds a suitable opponent for the given player. If no opponent is found, adds the player to the matchmaking queue.
 * @param requestingUsername The username of the player.
 * @returns An object containing the usernames of the matched players and the match ID, or undefined if no match was found.
 */
export const findMatchAndCreate = async (): Promise<[string, string, string] | undefined> => {
  const queue = await getQueue();
  for (const candidate of queue) {
    const suitableOpponent = await findSuitableOpponent(candidate);
    if (suitableOpponent) {
      await removeCandidate(candidate);
      await removeCandidate(suitableOpponent);
      const matchId = await newMatch(candidate.username, suitableOpponent.username, new Date());
      return [candidate.username, suitableOpponent.username, matchId];
    }
  }
  return undefined;
};

/**
 * Finds a suitable opponent for the requesting player and removes them from the queue.
 * @param requestingPlayerUsername the id of the requesting player
 * @returns the suitable opponent, or undefined if no suitable opponent is found
 */
export const findSuitableOpponent = async (
  requestingPlayerUsername: MatchmakingCandidate,
): Promise<MatchmakingCandidate | undefined> => {
  const queue = await getQueue();
  const suitableOpponent = await Array.from(queue).findAsync(
    async candidateOpponent => await isValidMatch(requestingPlayerUsername, candidateOpponent),
  );

  return suitableOpponent ? suitableOpponent : undefined;
};
