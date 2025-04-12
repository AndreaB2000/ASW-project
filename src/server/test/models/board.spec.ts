import { describe, it, expect } from '@jest/globals';
import * as boardFactory from '../../src/models/Board';
import * as pileFactory from '../../src/models/Pile';
import * as cellFactory from '../../src/models/Cell';

describe('Board', () => {
  const PLAYER1 = 'player1';
  const PLAYER2 = 'player2';

  it('should initialize with initial fields if nothing is specified', () => {
    const board = boardFactory.createDefault(PLAYER1, PLAYER2);

    // Checking board dimensions
    expect(board.width).toBe(boardFactory.DEFAULT_WIDTH);
    expect(board.height).toBe(boardFactory.DEFAULT_HEIGHT);

    // Checking initial state
    expect(board.state[2][2].pile).not.toBeNull();
    expect(board.state[2][2].pile?.owner).toBe(PLAYER1);
    expect(
      board.state[boardFactory.DEFAULT_WIDTH - 2][boardFactory.DEFAULT_WIDTH - 2].pile,
    ).not.toBeNull();
    expect(
      board.state[boardFactory.DEFAULT_WIDTH - 2][boardFactory.DEFAULT_WIDTH - 2].pile?.owner,
    ).toBe(PLAYER2);
  });

  it('should initialize with the specified fields', () => {
    const width = 6;
    const height = 7;
    const X = 0;
    const Y = 0;
    const numOfGrains = 1;
    const customState = [{ x: X, y: Y, pile: pileFactory.create(PLAYER1, numOfGrains) }];

    const customBoard = boardFactory.createCustom(PLAYER1, PLAYER2, width, height, customState);

    expect(customBoard.state[X][Y].pile).not.toBeNull();
    expect(customBoard.state[X][Y].pile?.owner).toBe(PLAYER1);
    expect(customBoard.width).toBe(width);
    expect(customBoard.height).toBe(height);
  });

  it('should throw an error if width or height is less or equal to 5', () => {
    const width = 5;
    const height = 7;
    const X = 0;
    const Y = 0;
    const numOfGrains = 1;
    const customState = [{ x: X, y: Y, pile: pileFactory.create(PLAYER1, numOfGrains) }];

    expect(() => boardFactory.createCustom(PLAYER1, PLAYER2, width, height, customState)).toThrow(
      'Board width and heignt must be greater than 5',
    );
  });

  it('should correctly get the requested cell', () => {
    const board = boardFactory.createDefault(PLAYER1, PLAYER2);

    expect(board.getCell(2, 2).pile).not.toBeNull();
    expect(board.getCell(2, 2).pile?.owner).toBe(PLAYER1);
    expect(board.getCell(2, 2).pile?.numberOfGrains).toBe(3);
  });

  it('should correctly set a cell to a new state', () => {
    const board = boardFactory.createDefault(PLAYER1, PLAYER2);
    const X = 0;
    const Y = 0;
    const numOfGrains = 1;

    board.setCell(X, Y, cellFactory.create(pileFactory.create(PLAYER1, numOfGrains)));

    expect(board.getCell(X, Y).pile).not.toBeNull();
    expect(board.getCell(X, Y).pile?.owner).toBe(PLAYER1);
    expect(board.getCell(X, Y).pile?.numberOfGrains).toBe(numOfGrains);
  });

  it('should unset a cell if the given update is null', () => {
    const board = boardFactory.createDefault(PLAYER1, PLAYER2);
    const X = 2;
    const Y = 2;

    board.setCell(X, Y, cellFactory.createEmpty());

    expect(board.getCell(X, Y).pile).toBeNull();
  });
});
