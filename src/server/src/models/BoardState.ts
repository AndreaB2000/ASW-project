/**
 * returns a pile object if owner is provided, otherwise an empty object
 * @param owner owner of the pile
 * @param grains number of grains on the pile initially
 * @returns a pile object
 */
function getPile(owner?: Player, grains?: number): Cell {
  if (owner && grains) {
    return { pile: { owner, grains } };
  }
  return {};
}

const initialGrains = 1;

/**
 * Value object representing the starting and second player in a sandpiles game
 */
export enum Player {
  PLAYER1,
  PLAYER2,
}

/**
 * Value object representing a pile of grains
 */
export interface Pile {
  owner: Player;
  grains: number;
}

/**
 * Value object representing a cell in the board
 */
export interface Cell {
  pile?: Pile;
}

/**
 * Value object representing the board state
 */
export type BoardState = Cell[][];

export function initialState(): BoardState {
  return [
    [
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
    ],
    [
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(Player.PLAYER1, initialGrains),
      getPile(),
      getPile(),
    ],
    [
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(Player.PLAYER1, initialGrains),
      getPile(),
      getPile(Player.PLAYER1, initialGrains),
      getPile(),
    ],
    [
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(Player.PLAYER1, initialGrains),
      getPile(),
      getPile(),
    ],
    [
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
    ],
    [
      getPile(),
      getPile(),
      getPile(Player.PLAYER2, initialGrains),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
    ],
    [
      getPile(),
      getPile(Player.PLAYER2, initialGrains),
      getPile(),
      getPile(Player.PLAYER2, initialGrains),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
    ],
    [
      getPile(),
      getPile(),
      getPile(Player.PLAYER2, initialGrains),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
    ],
    [
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
      getPile(),
    ],
  ];
}
