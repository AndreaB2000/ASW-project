import * as cellFactory from './Cell';
import { Cell } from './Cell';
import { Move } from './Move';
import * as pileFactory from './Pile';
import { Pile } from './Pile';

export interface Board {
  /**
   * The height of the board.
   */
  height: number;

  /**
   * The width of the board.
   */
  width: number;

  /**
   * The state of the board.
   */
  state: Cell[][];

  /**
   * Returns the cell at the specified position.
   *
   * @param x the horizontal coordinate.
   * @param y the vertical coordinate.
   */
  getCell(x: number, y: number): Cell;

  /**
   * Sets the value of the cell at the specified position.
   *
   * @param x the horizontal coordinate.
   * @param y the vertical coordinate.
   * @param cell the new cell.
   */
  setCell(x: number, y: number, cell: Cell): void;

  /**
   * Applies the privided move to the state.
   *
   * @param movingPlayer the player who is making the move.
   * @param move the move to be applied.
   */
  applyMove(movingPlayer: string, move: Move): void;

  /**
   * Creates a defensive copy of the board.
   */
  copy(): Board;
}

type BoardEntry = { x: number; y: number; pile: Pile };

// Based on the default initial piles positioning, width and height must be greater than 5
export const DEFAULT_WIDTH = 9;
export const DEFAULT_HEIGHT = 9;
const INITIAL_STATE = (player1: string, player2: string): BoardEntry[] => [
  { x: 2, y: 2, pile: pileFactory.create(player1, 3) },
  { x: DEFAULT_WIDTH - 3, y: DEFAULT_HEIGHT - 3, pile: pileFactory.create(player2, 3) },
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

  getCell(x: number, y: number): Cell {
    return this.state[x][y];
  }

  setCell(x: number, y: number, cell: Cell): void {
    this.state[x][y] = Object.assign({}, cell);
  }

  copy(): Board {
    // Estrae le pile esistenti per riutilizzare createCustom
    const existingPiles: BoardEntry[] = [];

    for (let x = 0; x < this.height; x++) {
      for (let y = 0; y < this.width; y++) {
        const cell = this.state[x][y];
        if (cell.pile) {
          existingPiles.push({
            x,
            y,
            pile: pileFactory.create(cell.pile.owner, cell.pile.numberOfGrains),
          });
        }
      }
    }

    return createCustom(this.width, this.height, existingPiles);
  }
}

export const createFromObject = (object: any): Board =>
  new BoardImpl(object.width, object.height, object.state);

export const createDefault = (player1: string, player2: string): Board =>
  createCustom(DEFAULT_WIDTH, DEFAULT_HEIGHT, INITIAL_STATE(player1, player2));

export const createCustom = (width: number, height: number, piles: Array<BoardEntry>): Board => {
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
