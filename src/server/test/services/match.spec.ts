import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { checkCalled, checkCalledWith } from '../test_utils/check-called';
import { newMatch, getMatch, getMatchesByPlayer, addMove } from '../../src/services/match';
import * as inProgressMatchRepo from '../../src/repositories/inProgressMatch';
import * as endedMatchRepo from '../../src/repositories/endedMatch';
import * as matchFactory from '../../src/models/Match';
import * as moveFactory from '../../src/models/Move';
import { Match } from '../../src/models/Match';

describe('Match Service', () => {
  const PLAYER1 = 'player1';
  const PLAYER2 = 'player2';
  const PLAYER3 = 'player3';
  const DATE = new Date();
  const TEST_ID = 'testid';
  const OTHER_ID = 'otherid';
  let EXPECTED_MATCH: Match;
  let MATCH_WITH_A_MOVE: Match;
  let MATCH_WITH_2_MOVES: Match;
  const OTHER_MATCH: Match = matchFactory.create(PLAYER3, PLAYER2, DATE);
  const TEST_MOVE = moveFactory.create(1, 2);
  const TEST_MOVE2 = moveFactory.create(2, 4);

  function initializeMatches() {
    EXPECTED_MATCH = matchFactory.create(PLAYER1, PLAYER2, DATE);
    MATCH_WITH_A_MOVE = matchFactory.create(PLAYER1, PLAYER2, DATE);
    MATCH_WITH_A_MOVE.addMove(TEST_MOVE);
    MATCH_WITH_2_MOVES = matchFactory.create(PLAYER1, PLAYER2, DATE);
    MATCH_WITH_2_MOVES.addMove(TEST_MOVE);
    MATCH_WITH_2_MOVES.addMove(TEST_MOVE2);
  }
  initializeMatches();

  beforeEach(() => {
    jest.clearAllMocks();
    initializeMatches();
  });

  describe('newMatch', () => {
    it('should create a new match in the inProgress repository, and return its ID', async () => {
      const newId = await checkCalledWith(
        newMatch,
        [EXPECTED_MATCH],
        inProgressMatchRepo,
        'createMatch',
        TEST_ID,
        [PLAYER1, PLAYER2, DATE],
      );
      expect(newId).toBe(TEST_ID);
    });
  });

  describe('getMatch', () => {
    it('should return the match corresponding to the given ID', async () => {
      const match = await checkCalledWith(
        getMatch,
        [TEST_ID],
        inProgressMatchRepo,
        'findMatch',
        [EXPECTED_MATCH],
        [TEST_ID],
      );
      expect(match).toStrictEqual([EXPECTED_MATCH]);
    });

    it('should return the match corresponding to the given ID if it is in progress', async () => {
      const mockEndedFun = jest.fn().mockReturnValue(null);
      jest.spyOn(endedMatchRepo, 'findMatch').mockImplementation(mockEndedFun as any);

      const mockInProgressFun = jest.fn().mockReturnValue(EXPECTED_MATCH);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockInProgressFun as any);

      const result = await getMatch(TEST_ID);

      expect(mockEndedFun).not.toHaveBeenCalled();
      expect(mockInProgressFun).toHaveBeenCalledWith(TEST_ID);
      expect(result).toStrictEqual(EXPECTED_MATCH);
    });

    it('should return the match corresponding to the given ID if it is ended', async () => {
      const mockEndedFun = jest.fn().mockReturnValue(EXPECTED_MATCH);
      jest.spyOn(endedMatchRepo, 'findMatch').mockImplementation(mockEndedFun as any);

      const mockInProgressFun = jest.fn().mockReturnValue(null);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockInProgressFun as any);

      const result = await getMatch(TEST_ID);

      expect(mockEndedFun).toHaveBeenCalledWith(TEST_ID);
      expect(mockInProgressFun).toHaveBeenCalledWith(TEST_ID);
      expect(result).toStrictEqual(EXPECTED_MATCH);
    });

    it('should return an empty list if the ID does not exist', async () => {
      const mockEndedFun = jest.fn().mockReturnValue(null);
      jest.spyOn(endedMatchRepo, 'findMatch').mockImplementation(mockEndedFun as any);

      const mockInProgressFun = jest.fn().mockReturnValue(null);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockInProgressFun as any);

      const result = await getMatch(OTHER_ID);

      expect(mockEndedFun).toHaveBeenCalledWith(OTHER_ID);
      expect(mockInProgressFun).toHaveBeenCalledWith(OTHER_ID);
      expect(result).toStrictEqual(null);
    });
  });

  describe('getMatchesByPlayer', () => {
    it('should return matches relative to the given player', async () => {
      const mockFun = jest.fn().mockReturnValue([EXPECTED_MATCH, OTHER_MATCH]);
      jest.spyOn(endedMatchRepo, 'findMatchesByPlayer').mockImplementation(mockFun as any);

      const mockFun2 = jest.fn().mockReturnValue([]);
      jest.spyOn(inProgressMatchRepo, 'findMatchesByPlayer').mockImplementation(mockFun2 as any);

      const result = await getMatchesByPlayer(PLAYER2);

      expect(mockFun).toHaveBeenCalledWith(PLAYER2);
      expect(result).toStrictEqual([EXPECTED_MATCH, OTHER_MATCH]);
    });
  });

  describe('addMove', () => {
    it('should add a move to the corresponding match if the given player can make a move', async () => {
      const mockFindMatch = jest
        .fn()
        .mockReturnValueOnce(EXPECTED_MATCH)
        .mockReturnValue(MATCH_WITH_A_MOVE);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockFindMatch as any);

      const mockUpdateMatch = jest.fn();
      jest.spyOn(inProgressMatchRepo, 'updateMatch').mockImplementation(mockUpdateMatch as any);

      const result = await addMove(TEST_ID, PLAYER1, TEST_MOVE);
      const result2 = await addMove(TEST_ID, PLAYER2, TEST_MOVE2);
      initializeMatches();

      expect(mockUpdateMatch).toHaveBeenNthCalledWith(1, TEST_ID, MATCH_WITH_A_MOVE);
      expect(mockUpdateMatch).toHaveBeenNthCalledWith(2, TEST_ID, MATCH_WITH_2_MOVES);
      expect(result).toBe(true);
      expect(result2).toBe(true);
    });

    it('should not add a move to the corresponding match if the given player cannot make a move', async () => {
      const mockFindMatch = jest.fn().mockReturnValue(EXPECTED_MATCH);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockFindMatch as any);

      const mockUpdateMatch = jest.fn();
      jest.spyOn(inProgressMatchRepo, 'updateMatch').mockImplementation(mockUpdateMatch as any);

      const result = await addMove(TEST_ID, PLAYER2, TEST_MOVE);

      expect(mockUpdateMatch).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should not add a move to the corresponding match if the given match ID does not exist', async () => {
      const mockFindMatch = jest.fn().mockReturnValue(null);
      jest.spyOn(inProgressMatchRepo, 'findMatch').mockImplementation(mockFindMatch as any);

      const mockUpdateMatch = jest.fn();
      jest.spyOn(inProgressMatchRepo, 'updateMatch').mockImplementation(mockUpdateMatch as any);

      const result = await addMove(OTHER_ID, PLAYER2, TEST_MOVE);

      expect(mockFindMatch).toHaveBeenCalledWith(OTHER_ID);
      expect(mockUpdateMatch).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
