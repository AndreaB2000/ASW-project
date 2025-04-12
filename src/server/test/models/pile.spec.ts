import { describe, it, expect } from '@jest/globals';
import * as pileFactory from '../../src/models/Pile';

describe('Pile', () => {
  const PLAYER = 'player';
  const NUM_OF_GRAINS = 1;
  it('should create a pile with the given owner and number of grains', () => {
    const pile = pileFactory.create(PLAYER, NUM_OF_GRAINS);

    expect(pile.owner).toBe(PLAYER);
    expect(pile.numberOfGrains).toBe(NUM_OF_GRAINS);
  });
  it('should throw an error if the number of grains is not between 1 and 4', () => {
    expect(() => pileFactory.create(PLAYER, 0)).toThrow(
      'The number of grains must be between 1 and 4',
    );
    expect(() => pileFactory.create(PLAYER, 5)).toThrow(
      'The number of grains must be between 1 and 4',
    );
  });
});
