export interface Move {
  x: number;
  y: number;
}

export const create = (x: number, y: number) => new MoveImpl(x, y);

class MoveImpl implements Move {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}
}
