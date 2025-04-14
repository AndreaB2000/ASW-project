import { MatchmakingQueue, MatchmakingQueueFactory } from '../../src/models/MatchmakingQueue';
import {
  MatchmakingCandidate,
  MatchmakingCandidateFactory,
} from '../../src/models/MatchmakingCandidate';
import { describe, it, expect, beforeEach } from '@jest/globals';

const candidateId1: string = 'testPlayerId1';
const candidateId2: string = 'testPlayerId2';
const rating1: number = 1500;
const rating2: number = 1600;
const requestTime1: Date = new Date('2023-10-01T00:00:00Z');
const requestTime2: Date = new Date('2023-10-02T00:00:00Z');
const candidate1: MatchmakingCandidate = MatchmakingCandidateFactory.create(
  candidateId1,
  rating1,
  requestTime1,
);
const candidate2: MatchmakingCandidate = MatchmakingCandidateFactory.create(
  candidateId2,
  rating2,
  requestTime2,
);

let testQueue: MatchmakingQueue;

beforeEach(() => {
  // Reset the state of the MatchmakingQueue before each test
  testQueue = MatchmakingQueueFactory.create();
});

describe('Matchmaking queue factory', () => {
  it('should create a new matchmaking queue', async () => {
    const queue: MatchmakingQueue = MatchmakingQueueFactory.create();

    expect(queue).not.toBeNull();
  });

  it('should create an empty matchmaking queue', async () => {
    const queue: MatchmakingQueue = MatchmakingQueueFactory.create();

    expect(queue.empty()).toBe(true);
  });

  it('should create a matchmaking queue with given candidates', async () => {
    const queue: MatchmakingQueue = MatchmakingQueueFactory.create([candidate1, candidate2]);

    expect(queue.empty()).toBe(false);
    expect(queue.size).toBe(2);
    expect(queue.has(candidateId1)).toBe(true);
    expect(queue.has(candidateId2)).toBe(true);
  });
});

describe('Matchmaking Queue', () => {
  it('should be empty on creation', async () => {
    expect(testQueue.empty()).toBe(true);
  });

  it('should not be empty after adding a candidate', async () => {
    testQueue.add(candidate1);
    expect(testQueue.empty()).toBe(false);
  });

  it('should have size 0 on creation', async () => {
    expect(testQueue.size).toBe(0);
  });

  it('should have size 1 after adding a candidate', async () => {
    testQueue.add(candidate1);
    expect(testQueue.size).toBe(1);
  });

  it('should work as an iterator', async () => {
    const candidates: MatchmakingCandidate[] = [candidate1, candidate2];
    candidates.forEach(candidate => testQueue.add(candidate));

    const iteratedCandidates: MatchmakingCandidate[] = Array.from(testQueue);

    expect(iteratedCandidates).toEqual(candidates);
  });

  it('should have a candidate if added', async () => {
    testQueue.add(candidate1);
    expect(testQueue.has(candidateId1)).toBe(true);
  });

  it('should return requested candidate if present', async () => {
    testQueue.add(candidate1);
    expect(testQueue.get(candidateId1)).toBe(candidate1);
  });

  it('should return undefined if requested candidate is not present', async () => {
    testQueue.add(candidate1);
    expect(testQueue.get(candidateId2)).toBeUndefined();
  });

  it('should remove candidate from queue', async () => {
    testQueue.add(candidate1);
    testQueue.add(candidate2);
    testQueue.remove(candidateId1);
    expect(testQueue.size).toBe(1);
    expect(testQueue.has(candidateId1)).toBe(false);
    expect(testQueue.has(candidateId2)).toBe(true);
  });

  it('should not remove candidate if not present', async () => {
    testQueue.add(candidate1);
    testQueue.remove(candidateId2);
    expect(testQueue.size).toBe(1);
    expect(testQueue.has(candidateId1)).toBe(true);
  });

  it('should return request time ordered based iterator', async () => {
    const candidate3 = MatchmakingCandidateFactory.create(
      'testPlayerId3',
      1700,
      new Date('2023-09-01:00:00Z'),
    );

    const candidates: MatchmakingCandidate[] = [candidate1, candidate2, candidate3];
    const queue: MatchmakingQueue = MatchmakingQueueFactory.create(candidates);
    const expectedOrder: MatchmakingCandidate[] = [
      candidate3,
      candidate1,
      candidate2,
    ];

    expect(Array.from(queue)).toEqual(expectedOrder);
  });
});
