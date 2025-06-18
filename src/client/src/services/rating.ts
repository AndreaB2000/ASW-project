import { roundToDecimal } from '../utils/round';

/**
 * enum GameResult
 * This enum represents the possible results of a game.
 * - WinA: Player A wins
 * - WinB: Player B wins
 * @enum {string}
 * @property {string} WinA - Player A wins
 * @property {string} WinB - Player B wins
 */
export enum GameResult {
  WinA = 'WinA',
  WinB = 'WinB',
}

const DEFAULT_K_FACTOR = 32;

/**
 * Calculate the rating change for a player based on the game result.
 * @param ratingA - The current rating of Player A.
 * @param ratingB - The current rating of Player B.
 * @param result - The result of the game.
 * @returns The rating change for Player A, rounded to 1 decimal place.
 */
export const getRatingChange = (
  ratingA: number,
  ratingB: number,
  result: GameResult,
): number => {
  const expectedScoreA = getExpectedScore(ratingA, ratingB);
  let scoreA: number;
  let scoreB: number;
  switch (result) {
    case GameResult.WinA:
      scoreA = 1;
      scoreB = 0;
      break;
    case GameResult.WinB:
      scoreA = 0;
      scoreB = 1;
      break;
  }
  const ratingUpdateA = DEFAULT_K_FACTOR * (scoreA - expectedScoreA);

  const roundedRatingUpdate = roundToDecimal(ratingUpdateA, 1);

  return roundedRatingUpdate;
};

/**
 * Calculate the expected score for Player A based on two player ratings.
 * The expected score is a value between 0 and 1, representing the probability of Player A winning.
 * @param ratingA - The current rating of Player A.
 * @param ratingB - The current rating of Player B.
 * @returns The expected score for Player A.
 */
const getExpectedScore = (ratingA: number, ratingB: number): number => {
  const expectedScoreA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  return expectedScoreA;
};