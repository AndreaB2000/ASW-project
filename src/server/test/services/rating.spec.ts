import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { GameResult, getNewRating } from '../../src/services/rating';

describe('Rating Service', () => {
  it('should calculate new ratings for Player A winning', () => {
    const ratingA = 1600;
    const ratingB = 1400;
    const result = GameResult.WinA;
    const kFactor = 32;

    const [newRatingA, newRatingB] = getNewRating(ratingA, ratingB, result, kFactor);

    expect(newRatingA).toBe(1607.7);
    expect(newRatingB).toBe(1392.3);
  });

  it('should calculate new ratings for Player B winning', () => {
    const ratingA = 1600;
    const ratingB = 1400;
    const result = GameResult.WinB;
    const kFactor = 32;

    const [newRatingA, newRatingB] = getNewRating(ratingA, ratingB, result, kFactor);

    expect(newRatingA).toBe(1575.7);
    expect(newRatingB).toBe(1424.3);
  });

  it('should calculate new ratings with a different K-factor', () => {
    const ratingA = 1600;
    const ratingB = 1400;
    const result = GameResult.WinA;
    const kFactor = 16;

    const [newRatingA, newRatingB] = getNewRating(ratingA, ratingB, result, kFactor);

    expect(newRatingA).toBe(1603.8);
    expect(newRatingB).toBe(1396.2);
  });

  it('should round to two decimal places', () => {
    const ratingA = 1600.1;
    const ratingB = 1400.6;
    const result = GameResult.WinA;
    const kFactor = 32;
    const [newRatingA, newRatingB] = getNewRating(ratingA, ratingB, result, kFactor);
    expect(newRatingA).toBe(1607.8);
    expect(newRatingB).toBe(1392.9);
  });

  it('should use default K-factor when not provided', () => {
    const ratingA = 1600;
    const ratingB = 1400;
    const result = GameResult.WinA;

    // Call without providing kFactor
    const [newRatingA, newRatingB] = getNewRating(ratingA, ratingB, result);

    // Compare with the result when using the default K-factor (32)
    const [expectedRatingA, expectedRatingB] = getNewRating(ratingA, ratingB, result, 32);

    expect(newRatingA).toBe(expectedRatingA);
    expect(newRatingB).toBe(expectedRatingB);
  });

  it('should handle equal ratings with Player A winning', () => {
    const ratingA = 1500;
    const ratingB = 1500;
    const result = GameResult.WinA;
    const kFactor = 32;

    const [newRatingA, newRatingB] = getNewRating(ratingA, ratingB, result, kFactor);

    // When ratings are equal, expected score is 0.5
    // So for a win (+1), the change should be 0.5 * kFactor = 16 points
    expect(newRatingA).toBe(1516.0);
    expect(newRatingB).toBe(1484.0);
  });

  it('should handle equal ratings with Player B winning', () => {
    const ratingA = 1500;
    const ratingB = 1500;
    const result = GameResult.WinB;
    const kFactor = 32;

    const [newRatingA, newRatingB] = getNewRating(ratingA, ratingB, result, kFactor);

    expect(newRatingA).toBe(1484.0);
    expect(newRatingB).toBe(1516.0);
  });

  it('should handle extreme rating differences with favorite winning', () => {
    const ratingA = 2400; // Grandmaster level
    const ratingB = 1200; // Beginner level
    const result = GameResult.WinA;
    const kFactor = 32;

    const [newRatingA, newRatingB] = getNewRating(ratingA, ratingB, result, kFactor);

    // When there's a huge rating difference, the expected outcome is already
    // factored into the calculation, so points gained/lost should be minimal
    expect(newRatingA - 2400).toBeLessThan(5); // Minimal gain for A
    expect(1200 - newRatingB).toBeLessThan(5); // Minimal loss for B
  });

  it('should handle extreme rating differences with upset', () => {
    const ratingA = 2400; // Grandmaster level
    const ratingB = 1200; // Beginner level
    const result = GameResult.WinB; // Unexpected outcome
    const kFactor = 32;

    const [newRatingA, newRatingB] = getNewRating(ratingA, ratingB, result, kFactor);

    // For an upset, rating changes should be significant
    expect(2400 - newRatingA).toBeGreaterThan(25); // Major loss for A
    expect(newRatingB - 1200).toBeGreaterThan(25); // Major gain for B
  });
});
