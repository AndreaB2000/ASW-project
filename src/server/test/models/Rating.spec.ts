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

  it('should always be higher', async () => {
    const rating: Rating = create(startingRating, startingDeviation, startingVolatility);

    expect(rating.higherThan()).toBe(true);
  });

});