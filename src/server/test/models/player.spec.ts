import { Player, PlayerFactory } from '../../src/models/Player';
import { Rating, RatingFactory } from '../../src/models/Rating';
import { describe, it, expect } from '@jest/globals';

const startingRating: number = 1500;
const PLAYER_NAME: string = 'Alice';
const PLAYER_RATING: Rating = RatingFactory.create(
  startingRating,
);

describe('Player factory', () => {
  it('should create a new player', async () => {
    const player: Player = PlayerFactory.create(PLAYER_NAME, PLAYER_RATING);

    expect(player).not.toBeNull();
  });
});

describe('Player Model', () => {
  it('should have correct username', async () => {
    const player: Player = PlayerFactory.create(PLAYER_NAME, PLAYER_RATING);

    expect(player.username).toBe(PLAYER_NAME);
  });

  it('should have a rating', async () => {
    const player: Player = PlayerFactory.create(PLAYER_NAME, PLAYER_RATING);

    expect(player.rating).not.toBeNull();
  });
});
