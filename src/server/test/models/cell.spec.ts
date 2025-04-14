import { describe, it, expect } from '@jest/globals';
import * as cellFactory from '../../src/models/Cell';
import * as pileFactory from '../../src/models/Pile';

describe('Cell', () => {
  const PLAYER = 'player';
  const NUM_OF_GRAINS = 1;

  it('should create an empty cell with createEmpty', () => {
    const cell = cellFactory.createEmpty();

    expect(cell.pile).toBeNull();
  });

  it('should create a cell with the given parameters', () => {
    const cell = cellFactory.create(pileFactory.create(PLAYER, NUM_OF_GRAINS));

    expect(cell.pile).not.toBeNull();
    expect(cell.pile.owner).toBe(PLAYER);
    expect(cell.pile.numberOfGrains).toBe(NUM_OF_GRAINS);
  });

  it('should create a pile if addGrain is called', () => {
    const cell = cellFactory.createEmpty();

    cell.addGrain(PLAYER);

    expect(cell.pile).not.toBeNull();
    expect(cell.pile.owner).toBe(PLAYER);
    expect(cell.pile.numberOfGrains).toBe(1);
  });

  it('should add a grain to the existing pile if addGrain is called', () => {
    const cell = cellFactory.create(pileFactory.create(PLAYER, NUM_OF_GRAINS));

    cell.addGrain(PLAYER);

    expect(cell.pile).not.toBeNull();
    expect(cell.pile.owner).toBe(PLAYER);
    expect(cell.pile.numberOfGrains).toBe(2);
  });

  it('should add a grain to the existing collapsing pile if addGrain is called', () => {
    const cell = cellFactory.create(pileFactory.create(PLAYER, 4));

    cell.addGrain(PLAYER);

    expect(cell.pile).not.toBeNull();
    expect(cell.pile.owner).toBe(PLAYER);
    expect(cell.pile.numberOfGrains).toBe(4 + 1);
  });

  it('should delete the pile if it is full and collapse is called', () => {
    const cell = cellFactory.create(pileFactory.create(PLAYER, 4));

    cell.collapse();

    expect(cell.pile).toBeNull();
  });

  it('should leave the pile untouched if it is not full and collapse is called', () => {
    const cell = cellFactory.create(pileFactory.create(PLAYER, NUM_OF_GRAINS));

    cell.collapse();

    expect(cell.pile).not.toBeNull();
    expect(cell.pile.owner).toBe(PLAYER);
    expect(cell.pile.numberOfGrains).toBe(NUM_OF_GRAINS);
  });

  it('should leave a spare grain in the pile if it is more than full and collapse is called', () => {
    const cell = cellFactory.create(pileFactory.create(PLAYER, 5));

    cell.collapse();

    expect(cell.pile).not.toBeNull();
    expect(cell.pile.owner).toBe(PLAYER);
    expect(cell.pile.numberOfGrains).toBe(5 - 4);
  });
});
