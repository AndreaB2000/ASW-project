import { describe, it, expect, jest } from '@jest/globals';
import { beforeEach } from 'node:test';
import * as moveFactory from '../../src/models/Move';
import { Move } from '../../src/models/Move';
import { addMove } from '../../src/controllers/match';
import * as matchService from '../../src/services/match';
import * as root from '../../src/routes/root';
import { Match } from '../../src/models/Match';
import * as matchFactory from '../../src/models/Match';
import * as boardFactory from '../../src/models/Board';
import * as pileFactory from '../../src/models/Pile';

describe('Match controller', () => {
  describe('addMove', () => {
    const testId: string = '507f1f77bcf86cd799439011';
    const player1: string = 'Alice';
    const player2: string = 'Bob';
    const now = new Date();
    const move: Move = moveFactory.create(1, 2);
    const mockMatch: Match = matchFactory.createWithDefaultInitialState(player1, player2, now);
    const mockMatchWithWinner: Match = matchFactory.createWithCustomInitialState(
      player1,
      player2,
      now,
      boardFactory.createCustom(9, 9, [{ x: 0, y: 0, pile: pileFactory.create(player1, 1) }]),
    );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should call addMove and emit 'move' message if it is player1's turn", async () => {
      const spyAddMove = jest.spyOn(matchService, 'addMove').mockResolvedValue(true);
      const spyGetMatch = jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatch);
      const spyEmitToRoom = jest.spyOn(root, 'emitToRoom').mockImplementation(() => {});

      await addMove(testId, player1, move);

      expect(spyAddMove).toHaveBeenCalledWith(testId, player1, move);
      expect(spyGetMatch).toHaveBeenCalledWith(testId);
      expect(spyEmitToRoom).toHaveBeenCalledWith(testId, 'move', player1, move.x, move.y);
    });

    it('should call emitToRoom twice if there is a winner', async () => {
      jest.spyOn(matchService, 'addMove').mockResolvedValue(true);
      jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatchWithWinner);
      const spyEmitToRoom = jest
        .spyOn(root, 'emitToRoom')
        .mockImplementation(() => {})
        .mockClear();

      await addMove(testId, player1, move);

      expect(spyEmitToRoom).toHaveBeenCalledTimes(2);
      expect(spyEmitToRoom).toHaveBeenNthCalledWith(1, testId, 'move', player1, move.x, move.y);
      expect(spyEmitToRoom).toHaveBeenNthCalledWith(2, testId, 'over', player1);
    });

    it('should call emitToRoom only once if there is no winner', async () => {
      jest.spyOn(matchService, 'addMove').mockResolvedValue(true);
      jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatch);
      const spyEmitToRoom = jest
        .spyOn(root, 'emitToRoom')
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
        .spyOn(root, 'emitToRoom')
        .mockImplementation(() => {})
        .mockClear();

      await addMove(testId, player1, move);

      expect(spyGetMatch).not.toHaveBeenCalled();
      expect(spyEmitToRoom).not.toHaveBeenCalled();
    });
  });
});
