import { Rating, RatingFactory } from '../../src/models/Rating';
import { describe, it, expect } from '@jest/globals';

const startingRating: number = 1500;
const startingDeviation: number = 350;
const startingVolatility: number = 0.06;

describe('Rating factory', () => {

  it('should create a new rating', async () => {
    const rating: Rating = RatingFactory.create(startingRating, startingDeviation, startingVolatility);

    expect(rating).not.toBeNull();
  });

});

describe('Rating Model', () => {

  it('should be higher than lower rating', async () => {
    const rating: Rating = RatingFactory.create(startingRating, startingDeviation, startingVolatility);
    const rating2: Rating = RatingFactory.create(startingRating - 100, startingDeviation, startingVolatility);

    expect(rating.higherThan(rating2)).toBe(true);
  });

  it('should be lower than higher rating', async () => {
    const rating: Rating = RatingFactory.create(startingRating, startingDeviation, startingVolatility);
    const rating2: Rating = RatingFactory.create(startingRating + 100, startingDeviation, startingVolatility);

    expect(rating.higherThan(rating2)).toBe(false);
  });

  it('should work with < operator', async () => {
    const rating: Rating = RatingFactory.create(startingRating, startingDeviation, startingVolatility);
    const rating2: Rating = RatingFactory.create(startingRating + 100, startingDeviation, startingVolatility);

    expect(rating < rating2).toBe(true);
  });

  it('should work with > operator', async () => {
    const rating: Rating = RatingFactory.create(startingRating, startingDeviation, startingVolatility);
    const rating2: Rating = RatingFactory.create(startingRating + 100, startingDeviation, startingVolatility);

    expect(rating > rating2).toBe(false);
  });

  it('should expose the rating', async () => {
    const rating: Rating = RatingFactory.create(startingRating, startingDeviation, startingVolatility);

    expect(rating.rating).toBe(startingRating);
  });

  it('should expose the deviation', async () => {
    const rating: Rating = RatingFactory.create(startingRating, startingDeviation, startingVolatility);

    expect(rating.deviation).toBe(startingDeviation);
  });

  it('should expose the volatility', async () => {
    const rating: Rating = RatingFactory.create(startingRating, startingDeviation, startingVolatility);

    expect(rating.volatility).toBe(startingVolatility);
  });
});