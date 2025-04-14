import * as boardFactory from './Board';
import { Board } from './Board';
import { Move } from './Move';

export interface Match {
  player1: string;
  player2: string;
  creationDate: Date;
  initialState: Board;
  moves: Move[];
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

  addMove(newMove: Move) {
    this.moves.push(newMove);
    return true;
  }
}
