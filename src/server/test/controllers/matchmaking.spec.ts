import { notifyNewMatch, requestMatch, requestMatchWithBot } from '../../src/controllers/matchmaking';
import * as matchmakingController from '../../src/controllers/matchmaking';
import { findMatch } from '../../src/services/matchmaking/matchmaking';
import { getPlayerSocket, registerPlayerSocket } from '../../src/sockets/socket';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Socket } from 'socket.io';
import { newMatch } from '../../src/services/match';

jest.mock('../../src/sockets/socket');
jest.mock('../../src/services/matchmaking/matchmaking');
jest.mock('../../src/routes/root');
jest.mock('../../src/services/match');

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
      (findMatch as jest.Mock).mockReturnValue(undefined);

      await requestMatch(mockSocket, testUsername);

      expect(registerPlayerSocket).toHaveBeenCalledWith(testUsername, mockSocket);
    });

    it('should search for a match', async () => {
      (findMatch as jest.Mock).mockReturnValue([testUsername, testOpponentUsername, testMatchId]);

      await requestMatch(mockSocket, testUsername);

      expect(findMatch).toHaveBeenCalledWith(testUsername);
    });

    it('should notify the new match if found', async () => {
      (findMatch as jest.Mock).mockReturnValue([testUsername, testOpponentUsername, testMatchId]);

      await requestMatch(mockSocket, testUsername);

      expect(notifyNewMatch).toHaveBeenCalledWith(testUsername, testOpponentUsername, testMatchId);
    });
  });
  
  describe('requestMatchWithBot', () => {
    // mock a Socket object
    const mockSocket = new Object() as unknown as Socket;
    const mockEmit = jest.fn();
    const mockJoin = jest.fn();
    const testUsername = 'testUser';
    const testMatchId = 'botMatch123';
    
    beforeEach(() => {
      jest.clearAllMocks();
      (registerPlayerSocket as jest.Mock).mockImplementation(() => {});
      (newMatch as jest.Mock).mockReturnValue(testMatchId);
      (getPlayerSocket as jest.Mock).mockReturnValue({ 
        join: mockJoin, 
        emit: mockEmit 
      });
    });

    it('should register the player socket', async () => {
      await requestMatchWithBot(mockSocket, testUsername);
      
      expect(registerPlayerSocket).toHaveBeenCalledWith(testUsername, mockSocket);
    });

    it('should create a new match with the bot', async () => {
      await requestMatchWithBot(mockSocket, testUsername);
      
      expect(newMatch).toHaveBeenCalledWith(testUsername, 'bot', expect.any(Date));
    });

    it('should notify the player about the match', async () => {
      await requestMatchWithBot(mockSocket, testUsername);
      
      expect(getPlayerSocket).toHaveBeenCalledWith(testUsername);
      expect(mockJoin).toHaveBeenCalledWith(testMatchId);
      expect(mockEmit).toHaveBeenCalledWith('matchFound', testMatchId);
    });

    it('should return the match ID', async () => {
      const result = await requestMatchWithBot(mockSocket, testUsername);
      
      expect(result).toBe(testMatchId);
    });
  });


  describe('notifyNewMatch', () => {
    const mockEmit = jest.fn();
    const mockJoinA = jest.fn();
    const mockJoinB = jest.fn();
    const mockEmitA = jest.fn();
    const mockEmitB = jest.fn();
    const playerAUsername = 'playerA';
    const playerBUsername = 'playerB';
    const matchId = 'match123';

    it('should join both users to the match and emit matchFound and matchStart', async () => {
      (getPlayerSocket as jest.Mock).mockImplementation(username => {
        if (username === playerAUsername) return { join: mockJoinA, emit: mockEmitA };
        if (username === playerBUsername) return { join: mockJoinB, emit: mockEmitB };
        return null;
      });

      await notifyNewMatch(playerAUsername, playerBUsername, matchId);

      expect(getPlayerSocket).toHaveBeenCalledWith(playerAUsername);
      expect(getPlayerSocket).toHaveBeenCalledWith(playerBUsername);

      expect(mockJoinA).toHaveBeenCalledWith(matchId);
      expect(mockJoinB).toHaveBeenCalledWith(matchId);
      expect(mockEmitA).toHaveBeenCalledWith('matchFound', matchId);
      expect(mockEmitB).toHaveBeenCalledWith('matchFound', matchId);
    });
  });
});
