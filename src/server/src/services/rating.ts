/**
 * Rating service
 * This service is responsible for calculating the rating of players based on their game results.
 * It uses the Elo rating system to calculate the new ratings.
 */

import { readAccountByUsername } from '../repositories/account';
import { roundToDecimal } from '../utils/round';

/**
 * getPlayerRating
 * This function retrieves the rating of a player by their username.
 * @param {string} username - The username of the player.
 * @returns {Promise<number | undefined>} - The rating of the player, or undefined if the player does not exist.
 */
export const getPlayerRating = async (username: string): Promise<number | undefined> => {
  const account = await readAccountByUsername(username);
  return account?.rating.value;
};

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
 * updateRating
 * This function calculates the new ratings for two players based on their current ratings and the result of the game.
 * It uses the Elo rating system to calculate the new ratings.
 * @param {number} ratingA - The current rating of Player A.
 * @param {number} ratingB - The current rating of Player B.
 * @param {GameResult} result - The result of the game.
 * @param {number} kFactor - The K-factor used in the Elo rating system. Default is 32.
 * @returns {[number, number]} - The new ratings for Player A and Player B, rounded to 2 decimal places.
 */
export const getNewRating = (
  ratingA: number,
  ratingB: number,
  result: GameResult,
  kFactor: number = DEFAULT_K_FACTOR,
): [number, number] => {
  const ratingChange = getRatingChange(ratingA, ratingB, result, kFactor);

  const newRatingA = ratingA + ratingChange;
  const newRatingB = ratingB - ratingChange;

  const roundedNewRatingA = roundToDecimal(newRatingA, 1);
  const roundedNewRatingB = roundToDecimal(newRatingB, 1);

  return [roundedNewRatingA, roundedNewRatingB];
};

/**
 * Calculate the rating change for a player based on the game result.
 * @param ratingA - The current rating of Player A.
 * @param ratingB - The current rating of Player B.
 * @param result - The result of the game.
 * @param kFactor - The K-factor used in the Elo rating system. Default is 32.
 * @returns The rating change for Player A, rounded to 1 decimal place.
 */
const getRatingChange = (
  ratingA: number,
  ratingB: number,
  result: GameResult,
  kFactor: number,
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
  const ratingUpdateA = kFactor * (scoreA - expectedScoreA);

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
