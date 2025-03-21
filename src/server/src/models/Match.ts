interface Pile {
  owner: Player;
  grains: number;
}

interface Cell {
  pile?: Pile;
}

export type BoardState = Cell[][];

export interface Move {
  x: number;
  y: number;
}

export enum Player {
  PLAYER1,
  PLAYER2,
}

/**
 * Value object representing a Sandpiles match
 */
export interface Match {
  /**
   * Returns the player1's username
   */
  get player1(): string; // player1 always starts first
  /**
   * Returns the player2's username
   */
  get player2(): string;
  /**
   * Returns the match creation date
   */
  get creationDate(): Date;
  /**
   * Returns the initial state of the board
   */
  get initialState(): BoardState;
  /**
   * Returns an sorted list of the moves
   */
  get moves(): Move[];
}

export class MatchImpl implements Match {
  /**
   * Match constructor
   * @param _player1 Player1's username
   * @param _player2 Player2's username
   */
  constructor(
    private readonly _player1: string,
    private readonly _player2: string,
    private readonly _creationDate?: Date,
  ) {}

  get player1(): string {
    return this._player1;
  }
  get player2(): string {
    return this._player2;
  }
  get creationDate(): Date {
    return this._creationDate;
  }
  get initialState(): BoardState {
    return [
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, { pile: { owner: Player.PLAYER1, grains: 1 } }, {}, {}],
      [
        {},
        {},
        {},
        {},
        {},
        { pile: { owner: Player.PLAYER1, grains: 1 } },
        {},
        { pile: { owner: Player.PLAYER1, grains: 1 } },
        {},
      ],
      [{}, {}, {}, {}, {}, {}, { pile: { owner: Player.PLAYER1, grains: 1 } }, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, { pile: { owner: Player.PLAYER2, grains: 1 } }, {}, {}, {}, {}, {}, {}],
      [
        {},
        { pile: { owner: Player.PLAYER2, grains: 1 } },
        {},
        { pile: { owner: Player.PLAYER2, grains: 1 } },
        {},
        {},
        {},
        {},
        {},
      ],
      [{}, {}, { pile: { owner: Player.PLAYER2, grains: 1 } }, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    ];
  }
  get moves(): Move[] {
    throw new Error('Method not implemented.');
  }
}
