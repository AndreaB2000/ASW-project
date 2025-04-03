import { Rating, create } from '../../src/models/Rating';
import { describe, it, expect } from '@jest/globals';

const startingRating: number = 1500;
const startingDeviation: number = 350;
const startingVolatility: number = 0.06;

describe('Rating factory', () => {

  it('should create a new rating', async () => {
    const rating: Rating = create(startingRating, startingDeviation, startingVolatility);

    expect(rating).not.toBeNull();
  });

});

describe('Rating Model', () => {

  it('should be higher than lower rating', async () => {
    const rating: Rating = create(startingRating, startingDeviation, startingVolatility);
    const rating2: Rating = create(startingRating - 100, startingDeviation, startingVolatility);

    expect(rating.higherThan(rating2)).toBe(true);
  });

  it('should be lower than higher rating', async () => {
    const rating: Rating = create(startingRating, startingDeviation, startingVolatility);
    const rating2: Rating = create(startingRating + 100, startingDeviation, startingVolatility);

    expect(rating.higherThan(rating2)).toBe(false);
  });

  it('should work with < operator', async () => {
    const rating: Rating = create(startingRating, startingDeviation, startingVolatility);
    const rating2: Rating = create(startingRating + 100, startingDeviation, startingVolatility);

    expect(rating < rating2).toBe(true);
  });

  it('should work with > operator', async () => {
    const rating: Rating = create(startingRating, startingDeviation, startingVolatility);
    const rating2: Rating = create(startingRating + 100, startingDeviation, startingVolatility);

    expect(rating > rating2).toBe(false);
  });
});