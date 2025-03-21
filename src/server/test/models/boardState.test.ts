import { BoardState, Cell, Player, initialState } from '../../src/models/BoardState';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

describe('InitialBoardStateFactory', () => {
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

  const testInitialState: BoardState = [
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

  it('should return a correct new intial state', async () => {
    expect(testInitialState).toEqual(initialState());
  });
});
