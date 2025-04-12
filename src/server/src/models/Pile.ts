export interface Pile {
  owner: string;
  numberOfGrains: number;
}

class PileImpl implements Pile {
  constructor(
    public owner: string,
    public numberOfGrains: number,
  ) {}
}

export const create = (owner: string, numberOfGrains: number): Pile => {
  if (numberOfGrains < 1 || numberOfGrains > 4) {
    throw new Error('The number of grains must be between 1 and 4');
  }
  return new PileImpl(owner, numberOfGrains);
};
