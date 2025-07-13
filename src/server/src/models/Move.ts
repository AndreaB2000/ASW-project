export interface Move {
  x: number;
  y: number;
}

/**
 * Value object representing a move.
 */
export class MoveFactory {
  /**
   * Move factory. Returns a move relative to the given coordinates.
   * @param x the x coordinate
   * @param y the y coordinate
   * @returns a move relative to the given coordinates
   */
  public static create = (x: number, y: number) => new MoveImpl(x, y);
}

class MoveImpl implements Move {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}
}
