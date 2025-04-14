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

class PileImpl implements Pile {
  constructor(
    public owner: string,
    public numberOfGrains: number,
  ) {}
}

export const create = (owner: string, numberOfGrains: number): Pile => {
  return new PileImpl(owner, numberOfGrains);
};
