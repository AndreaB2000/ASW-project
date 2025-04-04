import { Player, PlayerFactory } from '../../src/models/Player';
import { describe, it, expect } from '@jest/globals';

const PLAYER_NAME: string = 'Alice';

describe('Player factory', () => {

  it('should create a new player', async () => {
    const player: Player = PlayerFactory.create(PLAYER_NAME);

    expect(player).not.toBeNull();
  });

});

describe('Player Model', () => {

  it('should have correct username', async () => {
    const player: Player = PlayerFactory.create(PLAYER_NAME);

    expect(player.username).toBe(PLAYER_NAME);
  });

  it('should have a rating', async () => {
    const player: Player = PlayerFactory.create(PLAYER_NAME);

    expect(player.rating).not.toBeNull();
  });

});