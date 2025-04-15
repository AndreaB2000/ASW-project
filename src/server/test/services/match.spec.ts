import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { checkCalled, checkCalledWith } from '../test_utils/check-called';
import {
  newMatch,
  getMatch,
  getMatchesByPlayer,
  addMove,
  deleteMatch,
} from '../../src/services/match';
import * as inProgressMatchRepo from '../../src/repositories/inProgressMatch';
import * as endedMatchRepo from '../../src/repositories/endedMatch';
import * as matchFactory from '../../src/models/Match';
import * as moveFactory from '../../src/models/Move';
import * as boardFactory from '../../src/models/Board';
import { Match } from '../../src/models/Match';

describe('Match Service', () => {
  const player1 = 'player1';
  const player2 = 'player2';
  const player3 = 'player3';
  const DATE = new Date();
  const matchID = 'testid';
  const otherID = 'otherid';
  let expectedMatch: Match;
  let matchWithAMove: Match;
  let matchWith2Moves: Match;
  let matchWith3Moves: Match;
  const testMove = moveFactory.create(2, 2);
  const testMove2 = moveFactory.create(
    boardFactory.DEFAULT_WIDTH - 2,
    boardFactory.DEFAULT_HEIGHT - 2,
  );
  const testMove3 = moveFactory.create(3, 2);

  function initializeMatches() {
    expectedMatch = matchFactory.createWithDefaultInitialState(player1, player2, DATE);
    matchWithAMove = matchFactory.createWithDefaultInitialState(player1, player2, DATE);
    matchWithAMove.addMove(testMove);
    matchWith2Moves = matchFactory.createWithDefaultInitialState(player1, player2, DATE);
    matchWith2Moves.addMove(testMove);
    matchWith2Moves.addMove(testMove2);
    matchWith3Moves = matchFactory.createWithDefaultInitialState(player1, player2, DATE);
    matchWith3Moves.addMove(testMove);
    matchWith3Moves.addMove(testMove2);
    matchWith3Moves.addMove(testMove3);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    initializeMatches();
  });

  describe('newMatch', () => {
    it('should create a new match in the inProgress repository, and return its ID', async () => {
      const newId = await checkCalledWith(
        newMatch,
        [expectedMatch],
        inProgressMatchRepo,
        'createMatch',
        matchID,
        [player1, player2, DATE],
      );
      expect(newId).toBe(matchID);
    });
  });

  describe('getMatch', () => {
    it('should return the match corresponding to the given ID', async () => {
      const match = await checkCalledWith(
        getMatch,
        [matchID],
        inProgressMatchRepo,
        'findMatch',
        [expectedMatch],
        [matchID],
      );
      expect(match).toStrictEqual([expectedMatch]);
    });

    it('should return the match corresponding to the given ID if it is in progress', async () => {
      const mockEndedFun = jest.fn().mockReturnValue(null);
      jest.spyOn(endedMatchRepo, 'findMatch').mockImplementation(mockEndedFun as any);

      const mockInProgressFun = jest.fn().mockReturnValue(expectedMatch);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockInProgressFun as any);

      const result = await getMatch(matchID);

      expect(mockEndedFun).not.toHaveBeenCalled();
      expect(mockInProgressFun).toHaveBeenCalledWith(matchID);
      expect(result).toStrictEqual(expectedMatch);
    });

    it('should return the match corresponding to the given ID if it is ended', async () => {
      const mockEndedFun = jest.fn().mockReturnValue(expectedMatch);
      jest.spyOn(endedMatchRepo, 'findMatch').mockImplementation(mockEndedFun as any);

      const mockInProgressFun = jest.fn().mockReturnValue(null);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockInProgressFun as any);

      const result = await getMatch(matchID);

      expect(mockEndedFun).toHaveBeenCalledWith(matchID);
      expect(mockInProgressFun).toHaveBeenCalledWith(matchID);
      expect(result).toStrictEqual(expectedMatch);
    });

    it('should return an empty list if the ID does not exist', async () => {
      const mockEndedFun = jest.fn().mockReturnValue(null);
      jest.spyOn(endedMatchRepo, 'findMatch').mockImplementation(mockEndedFun as any);

      const mockInProgressFun = jest.fn().mockReturnValue(null);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockInProgressFun as any);

      const result = await getMatch(otherID);

      expect(mockEndedFun).toHaveBeenCalledWith(otherID);
      expect(mockInProgressFun).toHaveBeenCalledWith(otherID);
      expect(result).toStrictEqual(null);
    });
  });

  describe('getMatchesByPlayer', () => {
    it('should return matches relative to the given player', async () => {
      const mockFun = jest.fn().mockReturnValue([matchID, otherID]);
      jest.spyOn(endedMatchRepo, 'findMatchesByPlayer').mockImplementation(mockFun as any);

      const mockFun2 = jest.fn().mockReturnValue([]);
      jest.spyOn(inProgressMatchRepo, 'findMatchesByPlayer').mockImplementation(mockFun2 as any);

      const result = await getMatchesByPlayer(player2);

      expect(mockFun).toHaveBeenCalledWith(player2);
      expect(result).toStrictEqual([matchID, otherID]);
    });
  });

  describe('addMove', () => {
    it('should add multiple moves to the corresponding match if the given player can make a move', async () => {
      const mockFindMatch = jest
        .fn()
        .mockReturnValueOnce(expectedMatch)
        .mockReturnValueOnce(matchWithAMove)
        .mockReturnValue(matchWith2Moves);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockFindMatch as any);

      const mockUpdateMatch = jest.fn();
      jest.spyOn(inProgressMatchRepo, 'updateMatch').mockImplementation(mockUpdateMatch as any);

      const result = await addMove(matchID, player1, testMove);
      const result2 = await addMove(matchID, player2, testMove2);
      const result3 = await addMove(matchID, player1, testMove3);
      initializeMatches();

      expect(mockUpdateMatch).toHaveBeenNthCalledWith(1, matchID, matchWithAMove);
      expect(mockUpdateMatch).toHaveBeenNthCalledWith(2, matchID, matchWith2Moves);
      expect(mockUpdateMatch).toHaveBeenNthCalledWith(3, matchID, matchWith3Moves);
      expect(result).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
    });

    it('should not add a move to the corresponding match if the given player cannot make a move', async () => {
      const mockFindMatch = jest.fn().mockReturnValue(expectedMatch);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockFindMatch as any);

      const mockUpdateMatch = jest.fn();
      jest.spyOn(inProgressMatchRepo, 'updateMatch').mockImplementation(mockUpdateMatch as any);

      const result = await addMove(matchID, player2, testMove);

      expect(mockUpdateMatch).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should not add a move to the corresponding match if the given match ID does not exist', async () => {
      const mockFindMatch = jest.fn().mockReturnValue(null);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockFindMatch as any);

      const mockUpdateMatch = jest.fn();
      jest.spyOn(inProgressMatchRepo, 'updateMatch').mockImplementation(mockUpdateMatch as any);

      const result = await addMove(otherID, player2, testMove);

      expect(mockFindMatch).toHaveBeenCalledWith(otherID);
      expect(mockUpdateMatch).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('deleteMatch', () => {
    it('should delete an in progress match given its ID', async () => {
      const mockInProgressDelete = jest.fn().mockReturnValue(true);
      jest
        .spyOn(inProgressMatchRepo, 'deleteMatch')
        .mockImplementation(mockInProgressDelete as any);

      const mockEndedDelete = jest.fn().mockReturnValue(false);
      jest.spyOn(endedMatchRepo, 'deleteMatch').mockImplementation(mockEndedDelete as any);

      const result = await deleteMatch(matchID);

      expect(mockInProgressDelete).toHaveBeenCalledWith(matchID);
      expect(mockEndedDelete).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should delete an ended match given its ID', async () => {
      const mockInProgressDelete = jest.fn().mockReturnValue(false);
      jest
        .spyOn(inProgressMatchRepo, 'deleteMatch')
        .mockImplementation(mockInProgressDelete as any);

      const mockEndedDelete = jest.fn().mockReturnValue(true);
      jest.spyOn(endedMatchRepo, 'deleteMatch').mockImplementation(mockEndedDelete as any);

      const result = await deleteMatch(matchID);

      expect(mockInProgressDelete).toHaveBeenCalledWith(matchID);
      expect(mockEndedDelete).toHaveBeenCalledWith(matchID);
      expect(result).toBe(true);
    });

    it('should not delete a match if the give ID does not exist', async () => {
      const mockInProgressDelete = jest.fn().mockReturnValue(false);
      jest
        .spyOn(inProgressMatchRepo, 'deleteMatch')
        .mockImplementation(mockInProgressDelete as any);

      const mockEndedDelete = jest.fn().mockReturnValue(false);
      jest.spyOn(endedMatchRepo, 'deleteMatch').mockImplementation(mockEndedDelete as any);

      const result = await deleteMatch(matchID);

      expect(mockInProgressDelete).toHaveBeenCalledWith(matchID);
      expect(mockEndedDelete).toHaveBeenCalledWith(matchID);
      expect(result).toBe(false);
    });
  });
});
