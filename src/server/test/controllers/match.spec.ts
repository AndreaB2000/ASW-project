import { describe, it, expect, jest } from '@jest/globals';
import { beforeEach } from 'node:test';
import { Move, MoveFactory } from '../../src/models/Move';
import { addMove } from '../../src/controllers/match';
import * as matchService from '../../src/services/match';
import * as ratingService from '../../src/services/rating';
import * as accountService from '../../src/services/account';
import { Match, MatchFactory } from '../../src/models/Match';
import { BoardFactory } from '../../src/models/Board';
import { PileFactory } from '../../src/models/Pile';
import * as ioHandler from '../../src/sockets/socket';

describe('Match controller', () => {
  const testId: string = '507f1f77bcf86cd799439011';
  const player1: string = 'Alice';
  const player2: string = 'Bob';
  const now = new Date();
  const move: Move = MoveFactory.create(1, 2);
  const mockMatch: Match = MatchFactory.createWithDefaultInitialState(player1, player2, now);
  const mockMatchWithWinner1: Match = MatchFactory.createWithCustomInitialState(
    player1,
    player2,
    now,
    BoardFactory.createCustom(9, 9, [{ x: 0, y: 0, pile: PileFactory.create(player1, 1) }]),
  );
  const mockMatchWithWinner2: Match = MatchFactory.createWithCustomInitialState(
    player1,
    player2,
    now,
    BoardFactory.createCustom(9, 9, [{ x: 0, y: 0, pile: PileFactory.create(player2, 1) }]),
  );

  describe('addMove', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    it("should call addMove and emit 'move' message if it is player1's turn", async () => {
      const spyAddMove = jest.spyOn(matchService, 'addMove').mockResolvedValue(true);
      const spyGetMatch = jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatch);
      const spyEmitToRoom = jest.spyOn(ioHandler, 'emitToRoom').mockImplementation(() => {});

      await addMove(testId, player1, move);

      expect(spyAddMove).toHaveBeenCalledWith(testId, player1, move);
      expect(spyGetMatch).toHaveBeenCalledWith(testId);
      expect(spyEmitToRoom).toHaveBeenCalledWith(testId, 'move', player1, move.x, move.y);
    });

    it('should call emitToRoom twice if there is a winner (player1)', async () => {
      jest.spyOn(matchService, 'addMove').mockResolvedValue(true);
      jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatchWithWinner1);
      const spySaveMatch = jest.spyOn(matchService, 'saveMatch').mockResolvedValue(testId);
      jest.spyOn(ratingService, 'getNewRating').mockReturnValue([20, 40]);

      // Non-relevant mocks
      jest.spyOn(ratingService, 'getPlayerRating').mockResolvedValue(30);
      jest.spyOn(accountService, 'updateRating').mockResolvedValue(true);
      jest.spyOn(accountService, 'getAccount').mockResolvedValue(null);
      const spyEmitToRoom = jest
        .spyOn(ioHandler, 'emitToRoom')
        .mockImplementation(() => {})
        .mockClear();
      const spySocketsLeave = jest
        .spyOn(ioHandler, 'socketsLeave')
        .mockImplementation(() => {})
        .mockClear();

      await addMove(testId, player1, move);

      expect(spyEmitToRoom).toHaveBeenCalledTimes(2);
      expect(spyEmitToRoom).toHaveBeenNthCalledWith(1, testId, 'move', player1, move.x, move.y);
      expect(spyEmitToRoom).toHaveBeenNthCalledWith(2, testId, 'over', player1);
      expect(spySaveMatch).toHaveBeenCalledWith(testId, Math.abs(20 - 30)); // = Math.abs(40 - 30)
      expect(spySocketsLeave).toHaveBeenCalled();
    });

    it('should call emitToRoom twice if there is a winner (player2)', async () => {
      jest.spyOn(matchService, 'addMove').mockResolvedValue(true);
      jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatchWithWinner2);
      const spySaveMatch = jest.spyOn(matchService, 'saveMatch').mockResolvedValue(testId);
      jest.spyOn(ratingService, 'getNewRating').mockReturnValue([20, 40]);

      // Non-relevant mocks
      jest.spyOn(ratingService, 'getPlayerRating').mockResolvedValue(30);
      jest.spyOn(accountService, 'updateRating').mockResolvedValue(true);
      jest.spyOn(accountService, 'getAccount').mockResolvedValue(null);
      const spyEmitToRoom = jest
        .spyOn(ioHandler, 'emitToRoom')
        .mockImplementation(() => {})
        .mockClear();
      const spySocketsLeave = jest
        .spyOn(ioHandler, 'socketsLeave')
        .mockImplementation(() => {})
        .mockClear();

      await addMove(testId, player2, move);

      expect(spyEmitToRoom).toHaveBeenCalledTimes(2);
      expect(spyEmitToRoom).toHaveBeenNthCalledWith(1, testId, 'move', player2, move.x, move.y);
      expect(spyEmitToRoom).toHaveBeenNthCalledWith(2, testId, 'over', player2);
      expect(spySaveMatch).toHaveBeenCalledWith(testId, Math.abs(20 - 30)); // = Math.abs(40 - 30)
      expect(spySocketsLeave).toHaveBeenCalled();
    });

    it('should call emitToRoom only once if there is no winner', async () => {
      jest.spyOn(matchService, 'addMove').mockResolvedValue(true);
      jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatch);
      const spyEmitToRoom = jest
        .spyOn(ioHandler, 'emitToRoom')
        .mockImplementation(() => {})
        .mockClear();

      await addMove(testId, player1, move);

      expect(spyEmitToRoom).toHaveBeenCalledTimes(1);
      expect(spyEmitToRoom).toHaveBeenCalledWith(testId, 'move', player1, move.x, move.y);
    });

    it('should not call emitToRoom or getMatch if the move was invalid', async () => {
      jest.spyOn(matchService, 'addMove').mockResolvedValue(false);
      const spyGetMatch = jest
        .spyOn(matchService, 'getMatch')
        .mockResolvedValue(mockMatch)
        .mockClear();
      const spyEmitToRoom = jest
        .spyOn(ioHandler, 'emitToRoom')
        .mockImplementation(() => {})
        .mockClear();

      await addMove(testId, player1, move);

      expect(spyGetMatch).not.toHaveBeenCalled();
      expect(spyEmitToRoom).not.toHaveBeenCalled();
    });

    it('should report an error if the rating updates go wrong', async () => {
      jest.spyOn(matchService, 'addMove').mockResolvedValue(true);
      jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatchWithWinner1);
      jest.spyOn(matchService, 'saveMatch').mockResolvedValue(testId);
      jest.spyOn(ratingService, 'getNewRating').mockReturnValue([20, 40]);
      const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Non-relevant mocks
      jest.spyOn(ratingService, 'getPlayerRating').mockResolvedValue(30);
      jest.spyOn(accountService, 'updateRating').mockResolvedValue(false);
      jest.spyOn(accountService, 'getAccount').mockResolvedValue(null);
      jest
        .spyOn(ioHandler, 'emitToRoom')
        .mockImplementation(() => {})
        .mockClear();
      jest
        .spyOn(ioHandler, 'socketsLeave')
        .mockImplementation(() => {})
        .mockClear();

      await addMove(testId, player1, move);

      expect(spyConsoleError).toHaveBeenCalledWith('Error updating ratings');
    });
  });
});
