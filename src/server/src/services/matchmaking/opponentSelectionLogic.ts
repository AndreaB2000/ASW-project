import { MatchmakingCandidate } from '../../models/MatchmakingCandidate';

/**
 * Checks if two candidates are a valid match based on their ratings and the time since their requests.
 * The longer the time since the request, the larger the allowed difference.
 * @param candidate1 The first candidate.
 * @param candidate2 The second candidate.
 * @returns True if the candidates are a valid match, false otherwise.
 */
export const isValidMatch = async (candidate1: MatchmakingCandidate, candidate2: MatchmakingCandidate): Promise<boolean> => {
  if (candidate1.equals(candidate2)) {
    return false; // Players cannot match with themselves
  }

  // setting max difference to the one of the player with the lowest one
  const maxDiff1 = getMaxDiff(candidate1.requestTime);
  const maxDiff2 = getMaxDiff(candidate2.requestTime);
  const maxDiff = Math.min(maxDiff1, maxDiff2);

  return Math.abs(candidate1.rating.value - candidate2.rating.value) <= maxDiff;
};

/**
 * Calculates the maximum allowed rating difference based on the time since the request was made.
 * The longer the time since the request, the larger the allowed difference.
 * @param requestTime The time when the matchmaking request was made.
 * @returns The maximum allowed rating difference.
 */
export const getMaxDiff = (requestTime: Date): number => {
  const baseDiff = 100;

  const currentTime = new Date();
  const timeDiff = Math.abs(currentTime.getTime() - requestTime.getTime());
  // add 100 to baseDiff for every 10 seconds
  const diffInSeconds = Math.floor(timeDiff / 1000);
  const maxDiff = Math.floor(diffInSeconds / 10) * 100 + baseDiff;
  
  return maxDiff;
};