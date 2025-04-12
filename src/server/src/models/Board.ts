import { Cell } from './Cell';

export interface Board {
  height: number;
  width: number;
  state: Cell[][];
  getCell(x: number, y: number): Cell;
  setCell(x: number, y: number, cell: Cell): void;
}

class BoardImpl implements Board {
  constructor(
    public readonly height: number = 9,
    public readonly width: number = 9,
  ) {}

  state: Cell[][];

  getCell(x: number, y: number) {
    return this.state[x][y];
  }

  setCell(x: number, y: number, cell: Cell) {
    this.state[x][y] = Object.assign({}, cell);
  }
}
