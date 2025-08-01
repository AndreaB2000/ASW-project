import { describe, it, expect } from '@jest/globals';
import { BoardFactory } from '../../src/models/Board';
import { PileFactory } from '../../src/models/Pile';
import { CellFactory } from '../../src/models/Cell';
import { MoveFactory } from '../../src/models/Move';

describe('Board', () => {
  const PLAYER1 = 'player1';
  const PLAYER2 = 'player2';

  it('should initialize with initial fields if nothing is specified', () => {
    const board = BoardFactory.createDefault(PLAYER1, PLAYER2);

    // Checking board dimensions
    expect(board.width).toBe(BoardFactory.DEFAULT_WIDTH);
    expect(board.height).toBe(BoardFactory.DEFAULT_HEIGHT);

    // Checking initial state
    expect(board.state[3][2].pile).not.toBeNull();
    expect(board.state[3][2].pile?.owner).toBe(PLAYER1);
    expect(
      board.state[BoardFactory.DEFAULT_WIDTH - 4][BoardFactory.DEFAULT_WIDTH - 3].pile,
    ).not.toBeNull();
    expect(
      board.state[BoardFactory.DEFAULT_WIDTH - 4][BoardFactory.DEFAULT_WIDTH - 3].pile?.owner,
    ).toBe(PLAYER2);
  });

  it('should initialize with the specified fields', () => {
    const width = 6;
    const height = 7;
    const X = 0;
    const Y = 0;
    const numOfGrains = 1;
    const customState = [{ x: X, y: Y, pile: PileFactory.create(PLAYER1, numOfGrains) }];

    const customBoard = BoardFactory.createCustom(width, height, customState);

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
    const customState = [{ x: X, y: Y, pile: PileFactory.create(PLAYER1, numOfGrains) }];

    expect(() => BoardFactory.createCustom(width, height, customState)).toThrow(
      'Board width and heignt must be greater than 5',
    );
  });

  it('should correctly get the requested cell', () => {
    const board = BoardFactory.createDefault(PLAYER1, PLAYER2);

    expect(board.getCell(3, 2).pile).not.toBeNull();
    expect(board.getCell(3, 2).pile?.owner).toBe(PLAYER1);
    expect(board.getCell(3, 2).pile?.numberOfGrains).toBe(1);
  });

  it('should correctly set a cell to a new state', () => {
    const board = BoardFactory.createDefault(PLAYER1, PLAYER2);
    const X = 0;
    const Y = 0;
    const numOfGrains = 1;

    board.setCell(X, Y, CellFactory.create(PileFactory.create(PLAYER1, numOfGrains)));

    expect(board.getCell(X, Y).pile).not.toBeNull();
    expect(board.getCell(X, Y).pile?.owner).toBe(PLAYER1);
    expect(board.getCell(X, Y).pile?.numberOfGrains).toBe(numOfGrains);
  });

  it('should unset a cell if the given update is null', () => {
    const board = BoardFactory.createDefault(PLAYER1, PLAYER2);
    const X = 2;
    const Y = 2;

    board.setCell(X, Y, CellFactory.createEmpty());

    expect(board.getCell(X, Y).pile).toBeNull();
  });

  it('should apply a move on an empty cell', () => {
    const board = BoardFactory.createDefault(PLAYER1, PLAYER2);
    const X = 3;
    const Y = 3;
    const move = MoveFactory.create(X, Y);

    expect(board.getCell(3, 3).pile).toBeNull();

    board.applyMove(PLAYER1, move);

    expect(board.getCell(X, Y).pile).not.toBeNull();
    expect(board.getCell(X, Y).pile?.owner).toBe(PLAYER1);
    expect(board.getCell(X, Y).pile?.numberOfGrains).toBe(1);
  });

  it('should apply a move on an existing pile', () => {
    const board = BoardFactory.createDefault(PLAYER1, PLAYER2);
    const X = 3;
    const Y = 3;
    const move = MoveFactory.create(X, Y);

    board.applyMove(PLAYER1, move);
    board.applyMove(PLAYER1, move);

    expect(board.getCell(X, Y).pile).not.toBeNull();
    expect(board.getCell(X, Y).pile?.owner).toBe(PLAYER1);
    expect(board.getCell(X, Y).pile?.numberOfGrains).toBe(2);
  });

  it('should make a pile collapse', () => {
    const board = BoardFactory.createDefault(PLAYER1, PLAYER2);
    const X = 3;
    const Y = 2;
    const move = MoveFactory.create(X, Y);

    board.applyMove(PLAYER1, move);
    board.applyMove(PLAYER1, move);
    board.applyMove(PLAYER1, move);

    expect(board.getCell(X, Y).pile).toBeNull();

    [
      [X - 1, Y],
      [X + 1, Y],
      [X, Y + 1],
      [X, Y - 1],
    ].forEach(([x, y]) => {
      expect(board.getCell(x, y).pile).not.toBeNull();
      expect(board.getCell(x, y).pile?.owner).toBe(PLAYER1);
      expect(board.getCell(x, y).pile?.numberOfGrains).toBe(1);
    });
  });

  it('should have a "toroid" behavior', () => {
    const Y1 = 3;
    const Y2 = 6;
    const board = BoardFactory.createCustom(
      BoardFactory.DEFAULT_WIDTH,
      BoardFactory.DEFAULT_HEIGHT,
      [
        { x: 0, y: Y1, pile: PileFactory.create(PLAYER1, 3) },
        { x: BoardFactory.DEFAULT_WIDTH - 1, y: Y2, pile: PileFactory.create(PLAYER2, 3) },
      ],
    );

    board.applyMove(PLAYER1, MoveFactory.create(0, Y1));
    board.applyMove(PLAYER2, MoveFactory.create(BoardFactory.DEFAULT_WIDTH - 1, Y2));

    // "Backwards" toroid behavior
    expect(board.getCell(BoardFactory.DEFAULT_WIDTH - 1, Y1).pile).not.toBeNull();
    expect(board.getCell(BoardFactory.DEFAULT_WIDTH - 1, Y1).pile?.numberOfGrains).toBe(1);

    // "Forwards" toroid behavior
    expect(board.getCell(0, Y2).pile).not.toBeNull();
    expect(board.getCell(0, Y2).pile?.numberOfGrains).toBe(1);
  });

  it('should behave like expected in a specific scenario', () => {
    const board = BoardFactory.createCustom(
      BoardFactory.DEFAULT_WIDTH,
      BoardFactory.DEFAULT_HEIGHT,
      [
        { x: 7, y: 8, pile: PileFactory.create(PLAYER1, 1) },
        { x: 8, y: 7, pile: PileFactory.create(PLAYER1, 2) },
        { x: 7, y: 7, pile: PileFactory.create(PLAYER1, 3) },
        { x: 6, y: 7, pile: PileFactory.create(PLAYER1, 3) },
        { x: 7, y: 6, pile: PileFactory.create(PLAYER1, 3) },
        { x: 6, y: 6, pile: PileFactory.create(PLAYER1, 3) },
        { x: 8, y: 5, pile: PileFactory.create(PLAYER1, 1) },
        { x: 7, y: 5, pile: PileFactory.create(PLAYER1, 1) },
      ],
    );

    const boardAfterMove = BoardFactory.createCustom(
      BoardFactory.DEFAULT_WIDTH,
      BoardFactory.DEFAULT_HEIGHT,
      [
        { x: 7, y: 8, pile: PileFactory.create(PLAYER1, 2) },
        { x: 6, y: 8, pile: PileFactory.create(PLAYER1, 1) },
        { x: 8, y: 7, pile: PileFactory.create(PLAYER1, 3) },
        { x: 7, y: 7, pile: PileFactory.create(PLAYER1, 2) },
        { x: 6, y: 7, pile: PileFactory.create(PLAYER1, 1) },
        { x: 5, y: 7, pile: PileFactory.create(PLAYER1, 1) },
        { x: 8, y: 6, pile: PileFactory.create(PLAYER1, 1) },
        { x: 7, y: 6, pile: PileFactory.create(PLAYER1, 1) },
        { x: 6, y: 6, pile: PileFactory.create(PLAYER1, 1) },
        { x: 5, y: 6, pile: PileFactory.create(PLAYER1, 1) },
        { x: 8, y: 5, pile: PileFactory.create(PLAYER1, 1) },
        { x: 7, y: 5, pile: PileFactory.create(PLAYER1, 2) },
        { x: 6, y: 5, pile: PileFactory.create(PLAYER1, 1) },
      ],
    );

    board.applyMove(PLAYER1, MoveFactory.create(7, 7));

    expect(board.state).toStrictEqual(boardAfterMove.state);
  });

  it('should behave like expected in another specific scenario', () => {
    const board = BoardFactory.createCustom(8, 8, [
      { x: 6, y: 7, pile: PileFactory.create(PLAYER1, 1) },
      { x: 7, y: 6, pile: PileFactory.create(PLAYER1, 2) },
      { x: 6, y: 6, pile: PileFactory.create(PLAYER1, 1) },
      { x: 5, y: 6, pile: PileFactory.create(PLAYER1, 2) },
      { x: 6, y: 5, pile: PileFactory.create(PLAYER1, 3) },
      { x: 4, y: 5, pile: PileFactory.create(PLAYER1, 1) },
      { x: 0, y: 5, pile: PileFactory.create(PLAYER1, 1) },
      { x: 7, y: 4, pile: PileFactory.create(PLAYER1, 3) },
      { x: 6, y: 4, pile: PileFactory.create(PLAYER1, 3) },
      { x: 5, y: 4, pile: PileFactory.create(PLAYER1, 3) },

      { x: 7, y: 3, pile: PileFactory.create(PLAYER2, 3) },
      { x: 6, y: 3, pile: PileFactory.create(PLAYER2, 3) },
      { x: 5, y: 3, pile: PileFactory.create(PLAYER2, 3) },
      { x: 6, y: 2, pile: PileFactory.create(PLAYER2, 3) },
      { x: 4, y: 2, pile: PileFactory.create(PLAYER2, 1) },
      { x: 0, y: 2, pile: PileFactory.create(PLAYER2, 1) },
      { x: 7, y: 1, pile: PileFactory.create(PLAYER2, 2) },
      { x: 6, y: 1, pile: PileFactory.create(PLAYER2, 1) },
      { x: 5, y: 1, pile: PileFactory.create(PLAYER2, 2) },
      { x: 6, y: 0, pile: PileFactory.create(PLAYER2, 1) },
    ]);

    const boardAfterMove = BoardFactory.createCustom(8, 8, [
      { x: 6, y: 7, pile: PileFactory.create(PLAYER1, 1) },
      { x: 7, y: 6, pile: PileFactory.create(PLAYER1, 2) },
      { x: 6, y: 6, pile: PileFactory.create(PLAYER1, 2) },
      { x: 5, y: 6, pile: PileFactory.create(PLAYER1, 2) },
      { x: 7, y: 5, pile: PileFactory.create(PLAYER1, 2) },
      { x: 6, y: 5, pile: PileFactory.create(PLAYER1, 1) },
      { x: 5, y: 5, pile: PileFactory.create(PLAYER1, 2) },
      { x: 4, y: 5, pile: PileFactory.create(PLAYER1, 1) },
      { x: 0, y: 5, pile: PileFactory.create(PLAYER1, 1) },
      { x: 7, y: 4, pile: PileFactory.create(PLAYER1, 1) },
      { x: 6, y: 4, pile: PileFactory.create(PLAYER1, 3) },
      { x: 5, y: 4, pile: PileFactory.create(PLAYER1, 1) },
      { x: 4, y: 4, pile: PileFactory.create(PLAYER1, 1) },
      { x: 0, y: 4, pile: PileFactory.create(PLAYER1, 1) },
      { x: 7, y: 3, pile: PileFactory.create(PLAYER1, 1) },
      { x: 6, y: 3, pile: PileFactory.create(PLAYER1, 3) },
      { x: 5, y: 3, pile: PileFactory.create(PLAYER1, 1) },
      { x: 4, y: 3, pile: PileFactory.create(PLAYER1, 1) },
      { x: 0, y: 3, pile: PileFactory.create(PLAYER1, 1) },
      { x: 7, y: 2, pile: PileFactory.create(PLAYER1, 2) },
      { x: 5, y: 2, pile: PileFactory.create(PLAYER1, 2) },
      { x: 6, y: 1, pile: PileFactory.create(PLAYER1, 2) },

      { x: 4, y: 2, pile: PileFactory.create(PLAYER2, 1) },
      { x: 0, y: 2, pile: PileFactory.create(PLAYER2, 1) },
      { x: 7, y: 1, pile: PileFactory.create(PLAYER2, 2) },
      { x: 5, y: 1, pile: PileFactory.create(PLAYER2, 2) },
      { x: 6, y: 0, pile: PileFactory.create(PLAYER2, 1) },
    ]);

    board.applyMove(PLAYER1, MoveFactory.create(6, 5));

    expect(board.state).toStrictEqual(boardAfterMove.state);
  });
});
