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

describe('Matchmaking Queue Repository', () => {
  const testUsername = 'testUser';
  const testDate = new Date();
  const testCandidate = MatchmakingCandidateFactory.create(testUsername, testDate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getQueue', () => {
    it('should call find on DBMatchmakingCandidate', async () => {
      const mockCandidates = [
        { username: 'user1', requestTime: new Date() },
        { username: 'user2', requestTime: new Date() },
      ];

      await checkCalledWith(getQueue, [], DBMatchmakingCandidate, 'find', mockCandidates, []);
    });

    it('should return empty queue when no candidates found', async () => {
      const emptyQueue = MatchmakingQueueFactory.create();
      const queue = await checkCalledWith(getQueue, [], DBMatchmakingCandidate, 'find', [], []);

      expect(queue).toEqual(emptyQueue);
    });

    it('should map DB candidates to queue entries', async () => {
      const date1 = new Date();
      const date2 = new Date();
      const mockCandidates = [
        { username: 'user1', requestTime: date1 },
        { username: 'user2', requestTime: date2 },
      ];

      const mockFind = jest.fn().mockReturnValue(mockCandidates);

      jest.spyOn(DBMatchmakingCandidate, 'find').mockImplementation(mockFind as any);

      const queue = await getQueue();

      expect(mockFind).toHaveBeenCalled();

      // Convert queue to array since it's an Iterable
      const queueArray = Array.from(queue);
      expect(queue.size).toBe(2);
      expect(queueArray[0].username).toBe('user1');
      expect(queueArray[0].requestTime).toEqual(date1);
      expect(queueArray[1].username).toBe('user2');
      expect(queueArray[1].requestTime).toEqual(date2);
    });
  });

  describe('addCandidate', () => {
    it('should call findOneAndUpdate with correct parameters', async () => {
      const expectedWith = [
        { username: testUsername },
        { $set: { requestTime: testDate } },
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
        [testUsername],
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
