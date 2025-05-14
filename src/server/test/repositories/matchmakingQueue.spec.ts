import {
  DBMatchmakingCandidate,
  getQueue,
  addCandidate,
  removeCandidate,
  clearQueue,
} from '../../src/repositories/matchmakingQueue';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { MatchmakingCandidateFactory } from '../../src/models/MatchmakingCandidate';
import { MatchmakingQueueFactory } from '../../src/models/MatchmakingQueue';
import { checkCalled, checkCalledWith } from '../test_utils/check-called';
import { RatingFactory } from '../../src/models/Rating';

describe('Matchmaking Queue Repository', () => {
  const testUsername = 'testUser';
  const testRatingValue = 1500;
  const testRating = RatingFactory.create(testRatingValue);
  const testDate = new Date();
  const testCandidate = MatchmakingCandidateFactory.create(testUsername, testRating, testDate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getQueue', () => {
    const usernameA = 'userA';
    const usernameB = 'userB';
    const dateA = new Date('2023-10-01T00:00:00Z');
    const dateB = new Date('2023-10-01T00:00:00Z');
    const ratingA = RatingFactory.create(1500);
    const ratingB = RatingFactory.create(1600);
    const mockCandidates = [
      { username: usernameA, rating: ratingA, requestTime: dateA },
      { username: usernameB, rating: ratingB, requestTime: dateB },
    ];

    it('should call find on DBMatchmakingCandidate', async () => {
      await checkCalledWith(getQueue, [], DBMatchmakingCandidate, 'find', mockCandidates, []);
    });

    it('should return empty queue when no candidates found', async () => {
      const emptyQueue = MatchmakingQueueFactory.create();
      const queue = await checkCalledWith(getQueue, [], DBMatchmakingCandidate, 'find', [], []);

      expect(queue).toEqual(emptyQueue);
    });

    it('should map DB candidates to queue entries', async () => {
      const mockFind = jest.fn().mockReturnValue(mockCandidates);

      jest.spyOn(DBMatchmakingCandidate, 'find').mockImplementation(mockFind as any);

      const queue = await getQueue();

      expect(mockFind).toHaveBeenCalled();

      // Convert queue to array since it's an Iterable
      const queueArray = Array.from(queue);
      expect(queue.size).toBe(2);
      expect(queueArray[0].username).toBe(usernameA);
      expect(queueArray[0].rating).toEqual(ratingA);
      expect(queueArray[0].requestTime).toEqual(dateA);
      expect(queueArray[1].username).toBe(usernameB);
      expect(queueArray[1].rating).toEqual(ratingB);
      expect(queueArray[1].requestTime).toEqual(dateB);
    });
  });

  describe('addCandidate', () => {
    it('should call findOneAndUpdate with correct parameters', async () => {
      const expectedWith = [
        { username: testUsername },
        { $set: { rating: testRating, requestTime: testDate } },
        { upsert: true },
      ];

      await checkCalledWith(
        addCandidate,
        expectedWith,
        DBMatchmakingCandidate,
        'findOneAndUpdate',
        null,
        [testCandidate],
      );
    });
  });

  describe('removeCandidate', () => {
    it('should call deleteOne with correct parameters', async () => {
      await checkCalledWith(
        removeCandidate,
        [{ username: testUsername }],
        DBMatchmakingCandidate,
        'deleteOne',
        { acknowledged: true, deletedCount: 1 },
        [testCandidate],
      );
    });
  });

  describe('clearQueue', () => {
    it('should call deleteMany with empty filter', async () => {
      await checkCalledWith(
        clearQueue,
        [{}],
        DBMatchmakingCandidate,
        'deleteMany',
        { acknowledged: true, deletedCount: 2 },
        [],
      );
    });
  });
});
