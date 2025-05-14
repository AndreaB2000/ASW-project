import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createMatchIfPossible } from '../../src/routines/matchmaking';
import { findMatch } from '../../src/services/matchmaking/matchmaking';
import { notifyNewMatch } from '../../src/controllers/matchmaking';

jest.mock('../../src/services/matchmaking/matchmaking', () => ({
  findMatch: jest.fn(),
}));

jest.mock('../../src/controllers/matchmaking', () => ({
  notifyNewMatch: jest.fn(),
}));

describe('createMatchIfPossible', () => {
  const mockedFindMatch = findMatch as jest.MockedFunction<typeof findMatch>;
  const mockedNotifyNewMatch = notifyNewMatch as jest.MockedFunction<typeof notifyNewMatch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not call notifyNewMatch if no match is found', async () => {
    mockedFindMatch.mockResolvedValueOnce(undefined);

    await createMatchIfPossible();

    expect(mockedFindMatch).toHaveBeenCalledTimes(1);
    expect(mockedNotifyNewMatch).not.toHaveBeenCalled();
  });

  it('should call notifyNewMatch once if one match is found', async () => {
    mockedFindMatch
      .mockResolvedValueOnce(['Alice', 'Bob', 'match-1'])
      .mockResolvedValueOnce(undefined);

    await createMatchIfPossible();

    expect(mockedFindMatch).toHaveBeenCalledTimes(2);
    expect(mockedNotifyNewMatch).toHaveBeenCalledWith('Alice', 'Bob', 'match-1');
    expect(mockedNotifyNewMatch).toHaveBeenCalledTimes(1);
  });

  it('should call notifyNewMatch multiple times for multiple matches', async () => {
    mockedFindMatch
      .mockResolvedValueOnce(['Alice', 'Bob', 'match-1'])
      .mockResolvedValueOnce(['Carol', 'Dave', 'match-2'])
      .mockResolvedValueOnce(undefined);

    await createMatchIfPossible();

    expect(mockedFindMatch).toHaveBeenCalledTimes(3);
    expect(mockedNotifyNewMatch).toHaveBeenCalledTimes(2);
    expect(mockedNotifyNewMatch).toHaveBeenNthCalledWith(1, 'Alice', 'Bob', 'match-1');
    expect(mockedNotifyNewMatch).toHaveBeenNthCalledWith(2, 'Carol', 'Dave', 'match-2');
  });
});
