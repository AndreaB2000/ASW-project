import {
  MatchmakingCandidate,
  MatchmakingCandidateFactory,
} from '../../src/models/MatchmakingCandidate';
import { describe, it, expect, jest } from '@jest/globals';
import { Rating, RatingFactory } from '../../src/models/Rating';

const playerId: string = 'testPlayerId';
const playerRatingValue: number = 1500;
const playerRating: Rating = RatingFactory.create(playerRatingValue);
const requestTime: Date = new Date('2023-10-01T00:00:00Z');

describe('matchmaking candidate factory', () => {
  it('should create a correct new matchmaking candidate', async () => {
    const candidate: MatchmakingCandidate = MatchmakingCandidateFactory.create(
      playerId,
      playerRating,
      requestTime,
    );

    expect(candidate).not.toBeNull();
    expect(candidate.username).toBe(playerId);
    expect(candidate.rating).toEqual(playerRating);
    expect(candidate.requestTime).toEqual(requestTime);
  });

  it('should create a candidate with request time now if no time is passed', async () => {
    // Mock the Date constructor
    const mockNow = new Date('2024-10-01T00:00:00Z');
    global.Date = jest.fn(() => mockNow) as any;

    const candidate: MatchmakingCandidate = MatchmakingCandidateFactory.create(
      playerId,
      playerRating,
    );

    expect(candidate).not.toBeNull();
    expect(candidate.username).toBe(playerId);
    expect(candidate.rating).toEqual(playerRating);
    expect(candidate.requestTime).toEqual(mockNow);
  });

  it('should compare two candidates correctly', async () => {
    const candidate1: MatchmakingCandidate = MatchmakingCandidateFactory.create(
      playerId,
      playerRating,
      requestTime,
    );

    const candidate2: MatchmakingCandidate = MatchmakingCandidateFactory.create(
      playerId,
      playerRating,
      requestTime,
    );

    expect(candidate1.equals(candidate2)).toBe(true);
  });
});
