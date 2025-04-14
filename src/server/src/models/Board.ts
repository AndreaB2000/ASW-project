import * as cellFactory from './Cell';
import { Cell } from './Cell';
import { Move } from './Move';
import * as pileFactory from './Pile';
import { Pile } from './Pile';

export interface Board {
  height: number;
  width: number;
  state: Cell[][];
  getCell(x: number, y: number): Cell;
  setCell(x: number, y: number, cell: Cell): void;
  applyMove(movingPlayer: string, move: Move): void;
}

type BoardEntry = { x: number; y: number; pile: Pile };

// Based on the default initial piles positioning, width and heignt must be greater than 5
export const DEFAULT_WIDTH = 9;
export const DEFAULT_HEIGHT = 9;
const INITIAL_STATE = (player1: string, player2: string): BoardEntry[] => [
  { x: 2, y: 2, pile: pileFactory.create(player1, 3) },
  { x: DEFAULT_WIDTH - 2, y: DEFAULT_HEIGHT - 2, pile: pileFactory.create(player2, 3) },
];

class BoardImpl implements Board {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public state: Cell[][],
  ) {}

  applyMove(movingPlayer: string, move: Move): void {
    this.state[move.x][move.y].addGrain(movingPlayer);

    const collapsingPiles: [x: number, y: number][] = [];

    do {
      // Empties array
      collapsingPiles.length = 0;

      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          if (this.state[i][j].pile != null && this.state[i][j].pile.numberOfGrains >= 4)
            collapsingPiles.push([i, j]);
        }
      }

      collapsingPiles.forEach(([i, j]) => {
        this.state[i][j].collapse();

        this.state[(i - 1) % this.width][j].addGrain(movingPlayer);
        this.state[(i + 1) % this.width][j].addGrain(movingPlayer);
        this.state[i][(j - 1) % this.height].addGrain(movingPlayer);
        this.state[i][(j + 1) % this.height].addGrain(movingPlayer);
      });
    } while (collapsingPiles.length != 0);
  }

  getCell(x: number, y: number) {
    return this.state[x][y];
  }

  setCell(x: number, y: number, cell: Cell) {
    this.state[x][y] = Object.assign({}, cell);
  }
}

export const createDefault = (player1: string, player2: string): Board =>
  createCustom(player1, player2, DEFAULT_WIDTH, DEFAULT_HEIGHT, INITIAL_STATE(player1, player2));

export const createCustom = (
  player1: string,
  player2: string,
  width: number,
  height: number,
  piles: Array<BoardEntry>,
): Board => {
  if (width > 5 && height > 5) {
    return new BoardImpl(
      width,
      height,
      Array(height)
        .fill(null)
        .map((_, row) =>
          Array(width)
            .fill(null)
            .map((_, col) => {
              var ret = cellFactory.createEmpty();
              piles.forEach(p => {
                if (row === p.x && col === p.y) {
                  ret = cellFactory.create(pileFactory.create(p.pile.owner, p.pile.numberOfGrains));
                }
              });
              return ret;
            }),
        ),
    );
  } else {
    throw new Error('Board width and heignt must be greater than 5');
  }
};
