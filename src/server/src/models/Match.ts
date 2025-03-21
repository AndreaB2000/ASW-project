import { BoardState, initialState} from './BoardState';

export interface Move {
  x: number;
  y: number;
}

/**
 * Value object representing a Sandpiles match
 */
export interface Match {
  /**
   * Returns the player1's username
   */
  get player1Name(): string; // player1 always starts first
  /**
   * Returns the player2's username
   */
  get player2Name(): string;
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
   * @param _player1Name Player1's username
   * @param _player2Name Player2's username
   */
  constructor(
    private readonly _player1Name: string,
    private readonly _player2Name: string,
    private readonly _creationDate?: Date,
  ) {}

  get player1Name(): string {
    return this._player1Name;
  }
  get player2Name(): string {
    return this._player2Name;
  }
  get creationDate(): Date {
    return this._creationDate;
  }
  get initialState(): BoardState {
    return initialState();
  }
  get moves(): Move[] {
    throw new Error('Method not implemented.');
  }
}
