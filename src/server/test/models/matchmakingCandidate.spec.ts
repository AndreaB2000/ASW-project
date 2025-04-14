import {
  MatchmakingCandidate,
  MatchmakingCandidateFactory,
} from '../../src/models/MatchmakingCandidate';
import { describe, it, expect } from '@jest/globals';

const playerId: string = 'testPlayerId';
const rating: number = 1500;
const requestTime: Date = new Date('2023-10-01T00:00:00Z');

describe('matchmaking candidate factory', () => {
  it('should create a correct new matchmaking candidate', async () => {
    const candidate: MatchmakingCandidate = MatchmakingCandidateFactory.create(
      playerId,
      rating,
      requestTime,
    );

    expect(candidate).not.toBeNull();
    expect(candidate.playerId).toBe(playerId);
    expect(candidate.rating).toBe(rating);
    expect(candidate.requestTime).toEqual(requestTime);
  });
});
