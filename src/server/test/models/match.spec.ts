import { Match, MatchFactory } from '../../src/models/Match';
import { Move, MoveFactory } from '../../src/models/Move';
import { PileFactory } from '../../src/models/Pile';
import { BoardFactory } from '../../src/models/Board';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Match', () => {
  let match: Match;
  let matchWithCustomBoard: Match;
  const player1 = 'Alice';
  const player2 = 'Bob';
  const NOW = new Date();
  const validMove1 = MoveFactory.create(1, 2);
  const validMove2 = MoveFactory.create(
    BoardFactory.DEFAULT_WIDTH - 4,
    BoardFactory.DEFAULT_HEIGHT - 3,
  );
  const invalidMove = MoveFactory.create(2, 5);
  const customWidth = 6;
  const customHeight = 6;
  const customBoardEntry = { x: 0, y: 0, pile: PileFactory.create(player1, 1) };

  beforeEach(() => {
    match = MatchFactory.createWithDefaultInitialState(player1, player2, NOW);
    matchWithCustomBoard = MatchFactory.createWithCustomInitialState(
      player1,
      player2,
      NOW,
      BoardFactory.createCustom(customWidth, customHeight, [customBoardEntry]),
    );
  });

  describe('constructor', () => {
    it('should have the correct fields inside, given at creation time', () => {
      expect(match.player1).toBe(player1);
      expect(match.player2).toBe(player2);
      expect(match.creationDate).toBe(NOW);
      expect(match.moves).toStrictEqual([] as Move[]);
      expect(match.ratingDelta).toBe(null);
      expect(match.winner).toBe(null);
    });

    it('should create a match with a custom initial state', () => {
      expect(matchWithCustomBoard.initialState.width).toBe(customWidth);
      expect(matchWithCustomBoard.initialState.height).toBe(customHeight);
      expect(matchWithCustomBoard.initialState.getCell(0, 0).pile).not.toBeNull();
      expect(matchWithCustomBoard.initialState.getCell(0, 0).pile?.numberOfGrains).toBe(1);
    });
  });

  describe('addMove', () => {
    it('should add a move to the moves list', () => {
      const result = match.addMove(validMove1);

      expect(result).toBe(true);
      expect(match.moves.length).toBe(1);
      expect(match.moves[0]).toBe(validMove1);
    });

    it('should add multiple moves to the moves list in order', () => {
      const result1 = match.addMove(validMove1);
      const result2 = match.addMove(validMove2);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(match.moves.length).toBe(2);
      expect(match.moves[0]).toBe(validMove1);
      expect(match.moves[1]).toBe(validMove2);
    });

    it('should not add an invalid move (on a null pile)', () => {
      const result = match.addMove(invalidMove);

      expect(result).toBe(false);
      expect(match.moves.length).toBe(0);
    });

    it('should not add an invalid move (on a pile owned by someone else)', () => {
      const result = match.addMove(validMove2);

      expect(result).toBe(false);
      expect(match.moves.length).toBe(0);
    });

    it('should not change the initial board state', () => {
      match.addMove(validMove1);
      match.addMove(validMove2);

      expect(match.initialState).toStrictEqual(BoardFactory.createDefault(player1, player2));
    });
  });

  describe('winner', () => {
    it('should be null if the match is not finished', () => {
      expect(match.winner).toBeNull();
    });

    it("should be not null and contain the winner's username if the match is finished", () => {
      expect(matchWithCustomBoard.winner).not.toBeNull();
      expect(matchWithCustomBoard.winner).toBe(player1);
    });
  });

  describe('setRatingDelta', () => {
    it('should set a new value for the rating delta', () => {
      const newRatingDelta: number = 4.8;

      match.ratingDelta = newRatingDelta;
      expect(match.ratingDelta).not.toBe(null);
      expect(match.ratingDelta).toBe(newRatingDelta);
    });
  });
});
