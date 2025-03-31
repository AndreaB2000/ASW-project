import { Move } from './Move';

export interface Match {
  player1: string;
  player2: string;
  creationDate: Date;
  moves: Move[];
  addMove(newMove: Move): boolean;
}

export const create = (player1: string, player2: string, creationDate: Date): Match =>
  new MatchImpl(player1, player2, creationDate);

class MatchImpl implements Match {
  constructor(
    public readonly player1: string,
    public readonly player2: string,
    public readonly creationDate: Date,
    public readonly moves: Move[] = [],
  ) {}

  addMove(newMove: Move) {
    this.moves.push(newMove);
    return true;
  }
}
