import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  findMatchOrQueue,
  findSuitableOpponent,
  findMatchAndCreate,
  findMatch,
} from '../../../src/services/matchmaking/matchmaking';

import * as queueRepo from '../../../src/repositories/matchmakingQueue';
import * as opponentLogic from '../../../src/services/matchmaking/opponentSelectionLogic';
import * as playerRepo from '../../../src/repositories/player';
import * as matchService from '../../../src/services/match';
import * as matchmakingService from '../../../src/services/matchmaking/matchmaking';
import { MatchmakingCandidateFactory } from '../../../src/models/MatchmakingCandidate';
import { RatingFactory } from '../../../src/models/Rating';
import { MatchmakingQueueFactory } from '../../../src/models/MatchmakingQueue';
import { PlayerFactory } from '../../../src/models/Player';

jest.mock('../../../src/repositories/matchmakingQueue');
jest.mock('../../../src/repositories/player');
jest.mock('../../../src/services/match');
jest.mock('../../../src/services/matchmaking/opponentSelectionLogic');

beforeEach(() => {
  jest.restoreAllMocks();
});

const testRating = RatingFactory.create();
const testDate = new Date('2023-01-01T00:00:00Z');
const playerAUsername = 'playerA';
const playerBUsername = 'playerB';

describe('findMatchOrQueue', () => {
  const opponentCandidate = MatchmakingCandidateFactory.create(
    playerBUsername,
    testRating,
    testDate,
  );
  const requestingPlayer = PlayerFactory.create(playerAUsername, testRating);
  const matchId = 'match123';

  it('returns match data if suitable opponent is found', async () => {
    const testQueue = MatchmakingQueueFactory.create([opponentCandidate]);

    jest.spyOn(playerRepo, 'readPlayerByUsername').mockResolvedValue(requestingPlayer);
    jest.spyOn(queueRepo, 'getQueue').mockResolvedValue(testQueue);
    jest.spyOn(opponentLogic, 'isValidMatch').mockResolvedValue(true);
    jest.spyOn(queueRepo, 'removeCandidate').mockResolvedValue(undefined);
    jest.spyOn(matchService, 'newMatch').mockResolvedValue(matchId);

    const result = await findMatchOrQueue(playerAUsername);

    expect(result).toEqual([playerAUsername, opponentCandidate.username, 'match123']);
    expect(queueRepo.removeCandidate).toHaveBeenCalledWith(opponentCandidate);
  });

  it('adds candidate to queue if no match is found', async () => {
    const testQueue = MatchmakingQueueFactory.create();

    jest.spyOn(playerRepo, 'readPlayerByUsername').mockResolvedValue(requestingPlayer);
    jest.spyOn(queueRepo, 'getQueue').mockResolvedValue(testQueue);
    jest.spyOn(opponentLogic, 'isValidMatch').mockResolvedValue(false);
    const addSpy = jest.spyOn(queueRepo, 'addCandidate').mockResolvedValue(undefined);

    const result = await findMatchOrQueue(playerAUsername);
    expect(result).toBeUndefined();
    expect(addSpy).toHaveBeenCalled();
  });
});

describe('findMatchAndCreate', () => {
  const matchId = 'match123';

  it('creates a match for the first pair of compatible players', async () => {
    const playerACandidate = MatchmakingCandidateFactory.create(
      playerAUsername,
      testRating,
      testDate,
    );
    const playerBCandidate = MatchmakingCandidateFactory.create(
      playerBUsername,
      testRating,
      testDate,
    );
    const testQueue = MatchmakingQueueFactory.create([playerACandidate, playerBCandidate]);

    jest.spyOn(queueRepo, 'getQueue').mockResolvedValue(testQueue);
    jest
      .spyOn(opponentLogic, 'isValidMatch')
      .mockImplementation(async (a, b) => (a.username !== b.username ? true : false));

    const removeSpy = jest.spyOn(queueRepo, 'removeCandidate').mockResolvedValue(undefined);
    const newMatchSpy = jest.spyOn(matchService, 'newMatch').mockResolvedValue(matchId);

    const result = await findMatchAndCreate();

    expect(removeSpy).toHaveBeenCalledWith(playerBCandidate);
    expect(removeSpy).toHaveBeenCalledWith(playerACandidate);
    expect(newMatchSpy).toHaveBeenCalledWith(playerAUsername, playerBUsername, expect.any(Date));
    expect(result).toStrictEqual([playerAUsername, playerBUsername, matchId]);
  });

  it('returns undefined if no match is found', async () => {
    const playerACandidate = MatchmakingCandidateFactory.create(
      playerAUsername,
      testRating,
      testDate,
    );
    const playerBCandidate = MatchmakingCandidateFactory.create(
      playerBUsername,
      testRating,
      testDate,
    );
    const testQueue = MatchmakingQueueFactory.create([playerACandidate, playerBCandidate]);

    jest.spyOn(queueRepo, 'getQueue').mockResolvedValue(testQueue);
    jest.spyOn(opponentLogic, 'isValidMatch').mockResolvedValue(false);

    const result = await findMatchAndCreate();

    expect(result).toBeUndefined();
  });

  it('returns undefined if the queue is empty', async () => {
    const testQueue = MatchmakingQueueFactory.create([]);

    jest.spyOn(queueRepo, 'getQueue').mockResolvedValue(testQueue);

    const result = await findMatchAndCreate();

    expect(result).toBeUndefined();
  });

  it('returns undefined if the queue has only one candidate', async () => {
    const playerACandidate = MatchmakingCandidateFactory.create(
      playerAUsername,
      testRating,
      testDate,
    );
    const testQueue = MatchmakingQueueFactory.create([playerACandidate]);

    jest.spyOn(queueRepo, 'getQueue').mockResolvedValue(testQueue);

    const result = await findMatchAndCreate();

    expect(result).toBeUndefined();
  });
});

describe('findSuitableOpponent', () => {
  const requesterCandidate = MatchmakingCandidateFactory.create(
    playerAUsername,
    testRating,
    testDate,
  );
  const opponentCandidate = MatchmakingCandidateFactory.create(
    playerBUsername,
    testRating,
    testDate,
  );
  const testQueue = MatchmakingQueueFactory.create([opponentCandidate]);

  it('returns a valid opponent if one exists', async () => {
    jest.spyOn(queueRepo, 'getQueue').mockResolvedValue(testQueue);
    jest.spyOn(opponentLogic, 'isValidMatch').mockResolvedValue(true);

    const result = await findSuitableOpponent(requesterCandidate);
    expect(result).toEqual(opponentCandidate);
  });

  it('returns undefined if no valid opponent is found', async () => {
    jest.spyOn(queueRepo, 'getQueue').mockResolvedValue(testQueue);
    jest.spyOn(opponentLogic, 'isValidMatch').mockResolvedValue(false);

    const result = await findSuitableOpponent(requesterCandidate);
    expect(result).toBeUndefined();
  });
});

describe('findMatch', () => {
  it('calls findMatchAndCreate if no username is provided', async () => {
    const findMatchAndCreateSpy = jest.spyOn(matchmakingService, 'findMatchAndCreate').mockResolvedValue(undefined);

    await findMatch();

    expect(findMatchAndCreateSpy).toHaveBeenCalled();
  });

  it('calls findMatchOrQueue with the provided username', async () => {
    const testUsername = 'testUser';
    const findMatchOrQueueSpy = jest.spyOn(matchmakingService, 'findMatchOrQueue').mockResolvedValue(undefined);

    await findMatch(testUsername);

    expect(findMatchOrQueueSpy).toHaveBeenCalledWith(testUsername);
  });
});