import { requestMatch } from '../../src/controllers/matchmaking';
import * as matchmakingService from '../../src/services/matchmaking/matchmaking';
import * as rootRoutes from '../../src/routes/root';
import * as matchService from '../../src/services/match';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/services/matchmaking/matchmaking');
jest.mock('../../src/routes/root');
jest.mock('../../src/services/match');

describe('requestMatch', () => {
  const username = 'player1';
  const opponentUsername = 'player2';
  const matchId = 'match123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a match and emit matchFound if an opponent is found', async () => {
    // Mock findMatchOrQueue to return an opponent username
    jest.spyOn(matchmakingService, 'findMatchOrQueue').mockResolvedValue(opponentUsername);

    // Mock newMatch to return a match ID
    jest.spyOn(matchService, 'newMatch').mockResolvedValue(matchId);

    // Spy on emitUsername
    const emitUsernameSpy = jest.spyOn(rootRoutes, 'emitUsername');

    const result = await requestMatch(username);

    // Assertions
    expect(matchmakingService.findMatchOrQueue).toHaveBeenCalledWith(username);
    expect(matchService.newMatch).toHaveBeenCalledWith(username, opponentUsername, expect.any(Date));
    expect(emitUsernameSpy).toHaveBeenCalledWith(username, 'matchFound', matchId);
    expect(result).toBe(matchId);
  });

  it('should return null and not emit matchFound if no opponent is found', async () => {
    // Mock findMatchOrQueue to return null
    jest.spyOn(matchmakingService, 'findMatchOrQueue').mockResolvedValue(undefined);

    // Spy on emitUsername
    const emitUsernameSpy = jest.spyOn(rootRoutes, 'emitUsername');

    const result = await requestMatch(username);

    // Assertions
    expect(matchmakingService.findMatchOrQueue).toHaveBeenCalledWith(username);
    expect(matchService.newMatch).not.toHaveBeenCalled();
    expect(emitUsernameSpy).not.toHaveBeenCalled();
    expect(result).toBe(undefined);
  });
});