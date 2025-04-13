import { DBMatchmakingQueue } from '../../src/repositories/matchmakingQueue';
import { MatchmakingCandidateFactory } from '../../src/models/MatchmakingCandidate';
import { MatchmakingQueueFactory } from '../../src/models/MatchmakingQueue';
import {
  getQueue,
  addCandidate,
  removeCandidate,
  updateCandidate,
} from '../../src/repositories/matchmakingQueue';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { checkCalled, checkCalledWith } from '../test_utils/check-called';

const UNIQUE_ID = 'singleton';

describe('MatchmakingQueue Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getQueue', () => {
    it('should return queue if present in DB', async () => {
      const mockCandidates = [
        MatchmakingCandidateFactory.create('player1', 1500, 10, new Date()),
        MatchmakingCandidateFactory.create('player2', 1600, 20, new Date()),
      ];
      const returnedValue = await checkCalledWith(
        getQueue,
        [UNIQUE_ID],
        DBMatchmakingQueue,
        'findById',
        { lean: jest.fn().mockReturnValue({ candidates: mockCandidates }) },
        [],
      );

      expect(returnedValue).toEqual(MatchmakingQueueFactory.create(mockCandidates));
    });

    it('should create an empty queue if not present in DB', async () => {
      jest.spyOn(DBMatchmakingQueue, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(null as never),
      } as any);

      const returnedValue = await checkCalled(
        getQueue,
        DBMatchmakingQueue.prototype,
        'save',
        { candidates: [] },
        [],
      );

      expect(returnedValue).toEqual(MatchmakingQueueFactory.create([]));
    });
  });

  describe('addCandidate', () => {
    it('should call findByIdAndUpdate with correct parameters', async () => {
      const candidate = MatchmakingCandidateFactory.create('player1', 1500, 10, new Date());

      await checkCalledWith(
        addCandidate,
        [UNIQUE_ID, { $addToSet: { candidates: candidate } }, { upsert: true }],
        DBMatchmakingQueue,
        'findByIdAndUpdate',
        null,
        [candidate],
      );
    });
  });

  describe('removeCandidate', () => {
    it('should call findByIdAndUpdate with correct parameters', async () => {
      const candidateId = 'player1';

      await checkCalledWith(
        removeCandidate,
        [UNIQUE_ID, { $pull: { candidates: { id: candidateId } } }],
        DBMatchmakingQueue,
        'findByIdAndUpdate',
        null,
        [candidateId],
      );
    });
  });

  describe('updateCandidate', () => {
    it('should call findByIdAndUpdate with correct parameters', async () => {
      const candidateId = 'player1';
      const updatedCandidate = MatchmakingCandidateFactory.create(
        candidateId,
        1600,
        20,
        new Date(),
      );

      await checkCalledWith(
        updateCandidate,
        [
          UNIQUE_ID,
          { $set: { 'candidates.$[elem]': updatedCandidate } },
          { arrayFilters: [{ 'elem.id': candidateId }] },
        ],
        DBMatchmakingQueue,
        'findByIdAndUpdate',
        null,
        [candidateId, updatedCandidate],
      );
    });
  });
});
