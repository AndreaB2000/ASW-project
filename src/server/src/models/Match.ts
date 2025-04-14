import * as boardFactory from './Board';
import { Board } from './Board';
import { Move } from './Move';

export interface Match {
  /**
   * The first player (who has the first turn).
   */
  player1: string;

  /**
   * The second player.
   */
  player2: string;

  /**
   * The match creation date.
   */
  creationDate: Date;

  /**
   * The initial state of the board.
   */
  initialState: Board;

  /**
   * The list of the moves performed by the players. Moves owners alternates
   * starting from player1.
   */
  moves: Move[];

  /**
   * Adds a new move to the moves list, checking if it is possible.
   *
   * @param newMove the move to be added.
   * @returns true if the move had effect, false otherwise.
   */
  addMove(newMove: Move): boolean;
}

export const createWithDefaultInitialState = (
  player1: string,
  player2: string,
  creationDate: Date,
): Match =>
  new MatchImpl(player1, player2, creationDate, boardFactory.createDefault(player1, player2));

export const createWithCustomInitialState = (
  player1: string,
  player2: string,
  creationDate: Date,
  initialState: Board,
): Match => new MatchImpl(player1, player2, creationDate, initialState);

class MatchImpl implements Match {
  constructor(
    public readonly player1: string,
    public readonly player2: string,
    public readonly creationDate: Date,
    public readonly initialState: Board,
    public readonly moves: Move[] = [],
  ) {}

  addMove(newMove: Move): boolean {
    const currentState: Board = this.getCurrentState();
    const movingPlayer = this.moves.length % 2 == 0 ? this.player1 : this.player2;
    if (
      currentState.getCell(newMove.x, newMove.y).pile != null &&
      currentState.getCell(newMove.x, newMove.y).pile.owner == movingPlayer
    ) {
      this.moves.push(newMove);
      return true;
    }
    return false;
  }

  private getCurrentState(): Board {
    const ret = this.initialState.copy();

    for (let i = 0; i < this.moves.length; i++) {
      const move = this.moves[i];
      ret.applyMove(i % 2 == 0 ? this.player1 : this.player2, move);
    }
    return ret;
  }
}
