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

export const create = (owner: string, numberOfGrains: number): Pile | null => {
  if (numberOfGrains < 0 || numberOfGrains > 4) {
    return null;
  }
  return new PileImpl(owner, numberOfGrains);
};
