import {
  MatchmakingCandidate,
  MatchmakingCandidateFactory,
} from '../../src/models/MatchmakingCandidate';
import { describe, it, expect } from '@jest/globals';

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
});
