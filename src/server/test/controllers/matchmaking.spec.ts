import { notifyNewMatch, requestMatch } from '../../src/controllers/matchmaking';
import * as matchmakingController from '../../src/controllers/matchmaking';
import { emitUsername } from '../../src/routes/root';
import { findMatchOrQueue } from '../../src/services/matchmaking/matchmaking';
import { getIO, getPlayerSocket, registerPlayerSocket } from '../../src/sockets/socket';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Socket } from 'socket.io';

jest.mock('../../src/sockets/socket');
jest.mock('../../src/services/matchmaking/matchmaking');
jest.mock('../../src/routes/root');

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('Matchmaking Controller', () => {
  const testUsername = 'testUser';
  const testOpponentUsername = 'opponentUser';
  const testMatchId = 'match123';

  describe('requestMatch', () => {
    // mock a Socket object
    const mockSocket = new Object() as unknown as Socket;

    beforeEach(() => {
      (registerPlayerSocket as jest.Mock).mockImplementation(() => {});
      jest.spyOn(matchmakingController, 'notifyNewMatch').mockImplementation(() => {
        return Promise.resolve();
      });
    });

    it('should register the player socket', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue(undefined);

      await requestMatch(mockSocket, testUsername);

      expect(registerPlayerSocket).toHaveBeenCalledWith(testUsername, mockSocket);
    });

    it('should search for a match', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue([
        testUsername,
        testOpponentUsername,
        testMatchId,
      ]);

      await requestMatch(mockSocket, testUsername);

      expect(findMatchOrQueue).toHaveBeenCalledWith(testUsername);
    });

    it('should notify the new match if found', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue([
        testUsername,
        testOpponentUsername,
        testMatchId,
      ]);

      await requestMatch(mockSocket, testUsername);

      expect(notifyNewMatch).toHaveBeenCalledWith(testUsername, testOpponentUsername, testMatchId);
    });

    it('should return matchId if an opponent is found', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue([
        testUsername,
        testOpponentUsername,
        testMatchId,
      ]);

      const result = await requestMatch(mockSocket, testUsername);

      expect(result).toBe(testMatchId);
    });

    it('should return undefined when no opponent is found', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue(undefined);

      const result = await requestMatch(mockSocket, testUsername);

      expect(result).toBeUndefined();
    });
  });

  describe('notifyNewMatch', () => {
    const mockEmit = jest.fn();
    const mockJoinA = jest.fn();
    const mockJoinB = jest.fn();
    const playerAUsername = 'playerA';
    const playerBUsername = 'playerB';
    const matchId = 'match123';

    it('should join both users to the match and emit matchFound and matchStart', async () => {
      (getPlayerSocket as jest.Mock).mockImplementation(username => {
        if (username === playerAUsername) return { join: mockJoinA };
        if (username === playerBUsername) return { join: mockJoinB };
        return null;
      });

      const mockIO = { to: jest.fn().mockReturnThis(), emit: mockEmit };
      (getIO as jest.Mock).mockReturnValue(mockIO);

      await notifyNewMatch(playerAUsername, playerBUsername, matchId);

      expect(getPlayerSocket).toHaveBeenCalledWith(playerAUsername);
      expect(getPlayerSocket).toHaveBeenCalledWith(playerBUsername);

      expect(mockJoinA).toHaveBeenCalledWith(matchId);
      expect(mockJoinB).toHaveBeenCalledWith(matchId);
      expect(emitUsername).toHaveBeenCalledWith(playerAUsername, 'matchFound', matchId);
      expect(emitUsername).toHaveBeenCalledWith(playerBUsername, 'matchFound', matchId);

      expect(getIO).toHaveBeenCalled();
      expect(mockIO.to).toHaveBeenCalledWith(matchId);
      expect(mockEmit).toHaveBeenCalledWith('matchStart', matchId);
    });
  });
});
