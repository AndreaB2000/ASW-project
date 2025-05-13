import { notifyNewMatch, requestMatch } from '../../src/controllers/matchmaking';
import * as matchmakingController from '../../src/controllers/matchmaking';
import { findMatchOrQueue } from '../../src/services/matchmaking/matchmaking';
import { registerPlayerSocket } from '../../src/sockets/socket';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Socket } from 'socket.io';

jest.mock('../../src/sockets/socket');
jest.mock('../../src/services/matchmaking/matchmaking');

describe('Matchmaking Controller', () => {
  const testUsername = 'testUser';
  const testOpponentUsername = 'opponentUser';
  const testMatchId = 'match123';
  
  // mock a Socket object
  const mockSocket = new Object() as unknown as Socket;
  
  beforeEach(() => {
    jest.clearAllMocks();

    (registerPlayerSocket as jest.Mock).mockImplementation(() => {});
    jest.spyOn(matchmakingController, 'notifyNewMatch').mockImplementation(() => {return Promise.resolve();});
  });
  
  describe('requestMatch', () => {
    
    it('should register the player socket', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue(undefined);
      
      await requestMatch(mockSocket, testUsername);
      
      expect(registerPlayerSocket).toHaveBeenCalledWith(testUsername, mockSocket);
    });

    it('should search for a match', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue([testUsername, testOpponentUsername, testMatchId]);
      
      await requestMatch(mockSocket, testUsername);
      
      expect(findMatchOrQueue).toHaveBeenCalledWith(testUsername);
    });

    it('should notify the new match if found', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue([testUsername, testOpponentUsername, testMatchId]);
      
      await requestMatch(mockSocket, testUsername);
      
      expect(notifyNewMatch).toHaveBeenCalledWith(testUsername, testOpponentUsername, testMatchId);
    });

    it('should return matchId if an opponent is found', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue([testUsername, testOpponentUsername, testMatchId]);
      
      const result = await requestMatch(mockSocket, testUsername);
      
      expect(result).toBe(testMatchId);
    });
    
    it('should return undefined when no opponent is found', async () => {
      (findMatchOrQueue as jest.Mock).mockReturnValue(undefined);

      const result = await requestMatch(mockSocket, testUsername);
      
      expect(result).toBeUndefined();
    });
  });
});