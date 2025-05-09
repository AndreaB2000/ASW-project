import { requestMatch } from '../../src/controllers/matchmaking';
import { findMatchOrQueue } from '../../src/services/matchmaking/matchmaking';
import { newMatch } from '../../src/services/match';
import { getPlayerSocket, registerPlayerSocket } from '../../src/sockets/socket';
import * as ioHandler from '../../src/sockets/socket';
import { emitUsername } from '../../src/routes/root';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/services/matchmaking/matchmaking');
jest.mock('../../src/services/match');
jest.mock('../../src/sockets/socket');
jest.mock('../../src/routes/root');

describe('Matchmaking Controller', () => {
  const testUsername = 'testUser';
  const testOpponentUsername = 'opponentUser';
  const testMatchId = 'match123';
  
  const mockSocket = {
    join: jest.fn(),
  };
  
  const mockOpponentSocket = {
    join: jest.fn(),
  };
  
  const mockIO = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (getPlayerSocket as jest.Mock).mockReturnValue(mockOpponentSocket);
    (ioHandler.getIO as jest.Mock).mockReturnValue(mockIO);
  });
  
  it('should register player socket and find opponent', async () => {
    (findMatchOrQueue as jest.Mock).mockReturnValue(testOpponentUsername);
    (newMatch as jest.Mock).mockReturnValue(testMatchId);
    
    const result = await requestMatch(mockSocket as any, testUsername);
    
    expect(registerPlayerSocket).toHaveBeenCalledWith(testUsername, mockSocket);
    
    expect(findMatchOrQueue).toHaveBeenCalledWith(testUsername);
    
    expect(newMatch).toHaveBeenCalledWith(testUsername, testOpponentUsername, expect.any(Date));
    
    expect(mockSocket.join).toHaveBeenCalledWith(testMatchId);
    expect(mockOpponentSocket.join).toHaveBeenCalledWith(testMatchId);
    
    expect(emitUsername).toHaveBeenCalledWith(testUsername, 'matchFound', testMatchId);
    expect(emitUsername).toHaveBeenCalledWith(testOpponentUsername, 'matchFound', testMatchId);
    
    expect(mockIO.to).toHaveBeenCalledWith(testMatchId);
    expect(mockIO.emit).toHaveBeenCalledWith('matchStart', testMatchId);
    
    expect(result).toBe(testMatchId);
  });
  
  it('should return undefined when no opponent is found', async () => {
    (findMatchOrQueue as jest.Mock).mockReturnValue(undefined);
    
    const result = await requestMatch(mockSocket as any, testUsername);
    
    expect(registerPlayerSocket).toHaveBeenCalledWith(testUsername, mockSocket);
    
    expect(findMatchOrQueue).toHaveBeenCalledWith(testUsername);
    
    expect(newMatch).not.toHaveBeenCalled();
    
    expect(mockSocket.join).not.toHaveBeenCalled();
    expect(mockOpponentSocket.join).not.toHaveBeenCalled();
    
    expect(emitUsername).not.toHaveBeenCalled();
    
    expect(mockIO.to).not.toHaveBeenCalled();
    expect(mockIO.emit).not.toHaveBeenCalled();
    
    expect(result).toBeUndefined();
  });
});