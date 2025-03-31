interface Match {
  id: string;
  player1: string;
  player2: string;
  creationDate: Date;
  moves: Move[];
  addMove(newMove: Move): boolean;
}

class MatchImpl implements Match {
  public readonly id: string;
  public readonly player1: string;
  public readonly player2: string;
  public readonly creationDate: Date;
  public readonly moves: Move[] = [];

  addMove(newMove: Move) {
    this.moves.push(newMove);
    return true;
  }
}

class Move implements Move {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}
}
