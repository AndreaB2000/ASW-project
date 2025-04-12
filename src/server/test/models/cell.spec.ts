import { describe, it, expect } from '@jest/globals';
import * as cellFactory from '../../src/models/Cell';
import * as pileFactory from '../../src/models/Pile';

describe('Cell', () => {
  it('should create an empty cell with createEmpty', () => {
    const cell = cellFactory.createEmpty();

    expect(cell.pile).toBeNull();
  });

  it('should create a cell with the given parameters', () => {
    const player = 'player';
    const numOfGrains = 1;
    const cell = cellFactory.create(pileFactory.create(player, numOfGrains));

    expect(cell.pile).not.toBeNull();
    expect(cell.pile.owner).toBe(player);
    expect(cell.pile.numberOfGrains).toBe(numOfGrains);
  });
});
