import { Board, BoardFactory } from './Board';
import { Cell } from './Cell';
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

  /**
   * Calculates the current board state applying moves to the initial board state.
   */
  computeCurrentState(): Board;

  /**
   * The winner of the match. It is null when the match is not finished.
   */
  winner: string | null;

  /**
   * The score delta that the winner has earned and the looser has lost on match ending.
   */
  ratingDelta: number | null;
}

export class MatchFactory {
  public static createFromObject = (object: any) =>
    new MatchImpl(
      object.player1,
      object.player2,
      object.creationDate,
      BoardFactory.createFromObject(object.initialState),
      object.moves,
      object.ratingDelta,
    );

  public static createWithDefaultInitialState = (
    player1: string,
    player2: string,
    creationDate: Date,
  ): Match =>
    new MatchImpl(player1, player2, creationDate, BoardFactory.createDefault(player1, player2));

  public static createWithCustomInitialState = (
    player1: string,
    player2: string,
    creationDate: Date,
    initialState: Board,
  ): Match => new MatchImpl(player1, player2, creationDate, initialState);
}
class MatchImpl implements Match {
  constructor(
    public readonly player1: string,
    public readonly player2: string,
    public readonly creationDate: Date,
    public readonly initialState: Board,
    public readonly moves: Move[] = [],
    public ratingDelta: number | null = null,
  ) {}

  get winner(): string | null {
    let winner: string | null = null;
    const currentState: Cell[][] = this.computeCurrentState().state;

    for (const row of currentState) {
      for (const cell of row) {
        if (cell.pile) {
          if (JSON.stringify(cell.pile) != '{}') {
            if (winner == null) {
              winner = cell.pile.owner;
            } else if (cell.pile.owner != winner) {
              return null;
            }
          }
        }
      }
    }
    return winner;
  }

  addMove(newMove: Move): boolean {
    const currentState: Board = this.computeCurrentState();
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

  computeCurrentState(): Board {
    const ret = this.initialState.copy();

    for (let i = 0; i < this.moves.length; i++) {
      const move = this.moves[i];
      ret.applyMove(i % 2 == 0 ? this.player1 : this.player2, move);
    }
    return ret;
  }
}
