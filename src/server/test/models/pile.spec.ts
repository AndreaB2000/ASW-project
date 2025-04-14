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
});
