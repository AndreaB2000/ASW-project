import {
  MatchmakingCandidate,
  MatchmakingCandidateFactory,
} from '../../src/models/MatchmakingCandidate';
import { describe, it, expect, jest } from '@jest/globals';

const playerId: string = 'testPlayerId';
const requestTime: Date = new Date('2023-10-01T00:00:00Z');

describe('matchmaking candidate factory', () => {
  it('should create a correct new matchmaking candidate', async () => {
    const candidate: MatchmakingCandidate = MatchmakingCandidateFactory.create(
      playerId,
      requestTime,
    );

    expect(candidate).not.toBeNull();
    expect(candidate.username).toBe(playerId);
    expect(candidate.requestTime).toEqual(requestTime);
  });

  it('should create a candidate with request time now if no time is passed', async () => {
    // Mock the Date constructor
    const mockNow = new Date('2023-10-01T00:00:00Z');
    global.Date = jest.fn(() => mockNow) as any;

    const candidate: MatchmakingCandidate = MatchmakingCandidateFactory.create(playerId);

    expect(candidate).not.toBeNull();
    expect(candidate.username).toBe(playerId);
    expect(candidate.requestTime).toEqual(mockNow);
  });
});
