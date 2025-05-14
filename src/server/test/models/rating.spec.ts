import { Rating, RatingFactory } from '../../src/models/Rating';
import { describe, it, expect } from '@jest/globals';

const value: number = 1500;

describe('Rating factory', () => {
  it('should create a new rating', async () => {
    const rating: Rating = RatingFactory.create(value);

    expect(rating).not.toBeNull();
  });
});

describe('Rating Model', () => {
  it('should work with < operator', async () => {
    const rating: Rating = RatingFactory.create(value);
    const rating2: Rating = RatingFactory.create(value + 100);

    expect(rating < rating2).toBe(true);
  });

  it('should work with > operator', async () => {
    const rating: Rating = RatingFactory.create(value);
    const rating2: Rating = RatingFactory.create(value + 100);

    expect(rating > rating2).toBe(false);
  });

  it('should expose the rating', async () => {
    const rating: Rating = RatingFactory.create(value);

    expect(rating.value).toBe(value);
  });
});
