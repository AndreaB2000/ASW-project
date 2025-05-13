import {
  MatchmakingCandidateFactory,
} from '../../../src/models/MatchmakingCandidate';
import { RatingFactory } from '../../../src/models/Rating';
import { isValidMatch, getMaxDiff } from '../../../src/services/matchmaking/opponentSelectionLogic';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('opponentSelectionLogic', () => {
  const originalDate = global.Date;
  const mockNow = new Date('2023-01-01T12:00:00Z');

  beforeEach(() => {
    // Mock the current time to be fixed
    global.Date = jest.fn(() => mockNow) as any;
    global.Date.now = jest.fn(() => mockNow.getTime());
    // Restore other Date methods
    global.Date.UTC = originalDate.UTC;
    global.Date.parse = originalDate.parse;
  });

  afterEach(() => {
    global.Date = originalDate;
    jest.clearAllMocks();
  });

  describe('isValidMatch', () => {
    it('should match players with similar ratings and recent request times', async () => {
      // Create two candidates with similar ratings and recent request times
      const recentTime = new originalDate(mockNow.getTime() - 30 * 1000); // 30 seconds ago

      const candidate1 = MatchmakingCandidateFactory.create(
        'player1',
        RatingFactory.create(1500),
        recentTime,
      );

      const candidate2 = MatchmakingCandidateFactory.create(
        'player2',
        RatingFactory.create(1570),
        recentTime,
      );

      // With recent times, max diff should be around 100 (baseDiff)
      // 1570 - 1500 = 70, which is <= 100, so should match
      const result = await isValidMatch(candidate1, candidate2);
      expect(result).toBe(true);
    });

    it('should match players with different ratings but both with old request times', async () => {
      // Create two candidates with different ratings but old request times
      const oldTime1 = new originalDate(mockNow.getTime() - 20 * 60 * 1000); // 20 minutes ago
      const oldTime2 = new originalDate(mockNow.getTime() - 15 * 60 * 1000); // 15 minutes ago

      const candidate1 = MatchmakingCandidateFactory.create(
        'player1',
        RatingFactory.create(1500),
        oldTime1,
      );

      const candidate2 = MatchmakingCandidateFactory.create(
        'player2',
        RatingFactory.create(1800),
        oldTime2,
      );

      // With 15 minutes old (900 seconds), maxDiff would be 9000 + 100 = 9100
      // But we use the minimum of the two maxDiffs, so we use oldTime2's maxDiff
      // 1800 - 1500 = 300, which is <= min maxDiff, so should match
      const result = await isValidMatch(candidate1, candidate2);
      expect(result).toBe(true);
    });

    it('should use the minimum maxDiff when only one player has an old request time', async () => {
      // One recent, one old request time
      const recentTime = new originalDate(mockNow.getTime() - 1 * 60 * 1000); // 1 minute ago
      const oldTime = new originalDate(mockNow.getTime() - 30 * 60 * 1000); // 30 minutes ago

      const candidate1 = MatchmakingCandidateFactory.create(
        'player1',
        RatingFactory.create(1500),
        recentTime,
      );

      const candidate2 = MatchmakingCandidateFactory.create(
        'player2',
        RatingFactory.create(1650),
        oldTime,
      );

      // With recentTime (60 seconds), maxDiff for player1 is 600 + 100 = 700
      // We use the minimum maxDiff, which is player1's
      // 1650 - 1500 = 150, which is <= 700, so should match
      const result = await isValidMatch(candidate1, candidate2);
      expect(result).toBe(true);
    });

    it('should not match players with very different ratings and recent request times', async () => {
      // Both recent times, big rating gap
      const recentTime = new originalDate(mockNow.getTime() - 10 * 1000); // 30 seconds ago

      const candidate1 = MatchmakingCandidateFactory.create(
        'player1',
        RatingFactory.create(1500),
        recentTime,
      );

      const candidate2 = MatchmakingCandidateFactory.create(
        'player2',
        RatingFactory.create(1800),
        recentTime,
      );

      // With recent times, max diff should be around 100 (baseDiff)
      // 1800 - 1500 = 300, which is > 200, so should not match
      const result = await isValidMatch(candidate1, candidate2);
      expect(result).toBe(false);
    });

    it('should not match players with different ratings where time difference is insufficient', async () => {
      // Some time difference but not enough for the rating gap
      const time = new originalDate(mockNow.getTime() - 2 * 60 * 1000); // 2 minutes ago

      const candidate1 = MatchmakingCandidateFactory.create(
        'player1',
        RatingFactory.create(1500),
        time,
      );

      const candidate2 = MatchmakingCandidateFactory.create(
        'player2',
        RatingFactory.create(1900),
        time,
      );

      // With 2 minutes (120 seconds), maxDiff is 1200 + 100 = 1300
      // 1900 - 1500 = 400, which is <= 1300, so should match
      const result = await isValidMatch(candidate1, candidate2);
      expect(result).toBe(true);
    });

    it('should not match a player with itself', async () => {
      const recentTime = new originalDate(mockNow.getTime() - 10 * 1000); // 10 seconds ago

      const candidate1 = MatchmakingCandidateFactory.create(
        'player1',
        RatingFactory.create(1500),
        recentTime,
      );

      const candidate2 = MatchmakingCandidateFactory.create(
        'player1',
        RatingFactory.create(1500),
        recentTime,
      );

      const result = await isValidMatch(candidate1, candidate2);
      expect(result).toBe(false);

    });
  });

  describe('getMaxDiff', () => {
    it('should return baseDiff for recent request times', () => {
      const recentTime = new Date('2023-01-01T11:59:50Z'); // 10 seconds ago
      const maxDiff = getMaxDiff(recentTime);
      expect(maxDiff).toBe(100); // baseDiff
    });

    it('should increase maxDiff by 100 for every 10 seconds', () => {
      const time30Seconds = new originalDate(mockNow.getTime() - 30 * 1000); // 30 seconds ago
      const maxDiff30 = getMaxDiff(time30Seconds);
      expect(maxDiff30).toBe(400); // baseDiff + (30/10)*100

      const time2Minutes = new originalDate(mockNow.getTime() - 120 * 1000); // 2 minutes (120 seconds) ago
      const maxDiff120 = getMaxDiff(time2Minutes);
      expect(maxDiff120).toBe(1300); // baseDiff + (120/10)*100
    });
  });
});
