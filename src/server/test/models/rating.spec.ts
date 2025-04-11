import { Rating, RatingFactory } from '../../src/models/Rating';
import { describe, it, expect } from '@jest/globals';

const value: number = 1500;
const deviation: number = 350;
const volatility: number = 0.06;

describe('Rating factory', () => {
  it('should create a new rating', async () => {
    const rating: Rating = RatingFactory.create(value, deviation, volatility);

    expect(rating).not.toBeNull();
  });
});

describe('Rating Model', () => {
  it('should work with < operator', async () => {
    const rating: Rating = RatingFactory.create(value, deviation, volatility);
    const rating2: Rating = RatingFactory.create(value + 100, deviation, volatility);

    expect(rating < rating2).toBe(true);
  });

  it('should work with > operator', async () => {
    const rating: Rating = RatingFactory.create(value, deviation, volatility);
    const rating2: Rating = RatingFactory.create(value + 100, deviation, volatility);

    expect(rating > rating2).toBe(false);
  });

  it('should expose the rating', async () => {
    const rating: Rating = RatingFactory.create(value, deviation, volatility);

    expect(rating.value).toBe(value);
  });

  it('should expose the deviation', async () => {
    const rating: Rating = RatingFactory.create(value, deviation, volatility);

    expect(rating.deviation).toBe(deviation);
  });

  it('should expose the volatility', async () => {
    const rating: Rating = RatingFactory.create(value, deviation, volatility);

    expect(rating.volatility).toBe(volatility);
  });
});
