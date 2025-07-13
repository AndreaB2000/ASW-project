/**
 * Entity representing a pile.
 */
export interface Pile {
  /**
   * The owner of the pile.
   */
  owner: string;

  /**
   * The number of grains contained in the pile.
   */
  numberOfGrains: number;
}

export class PileFactory {
  /**
   * Returns a pile assigned to the give owner, with the given number of grains.
   * @param owner the owner of the pile
   * @param numberOfGrains the number of grains contained in the pile
   * @returns a pile assigned to the give owner, with the given number of grains
   */
  public static create = (owner: string, numberOfGrains: number): Pile =>
    new PileImpl(owner, numberOfGrains);
}

class PileImpl implements Pile {
  constructor(
    public owner: string,
    public numberOfGrains: number,
  ) {}
}
