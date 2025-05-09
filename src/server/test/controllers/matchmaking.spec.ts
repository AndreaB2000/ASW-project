import { requestMatch } from '../../src/controllers/matchmaking';
import { findMatchOrQueue } from '../../src/services/matchmaking/matchmaking';
import { newMatch } from '../../src/services/match';
import { getPlayerSocket, registerPlayerSocket } from '../../src/sockets/socket';
import * as ioHandler from '../../src/sockets/socket';
import { emitUsername } from '../../src/routes/root';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock all dependencies
jest.mock('../../src/services/matchmaking/matchmaking');
jest.mock('../../src/services/match');
jest.mock('../../src/sockets/socket');
jest.mock('../../src/routes/root');

describe('Matchmaking Controller', () => {
  // Test variables
  const testUsername = 'testUser';
  const testOpponentUsername = 'opponentUser';
  const testMatchId = 'match123';
  
  // Mock Socket object
  const mockSocket = {
    join: jest.fn(),
  };
  
  // Mock opponent Socket
  const mockOpponentSocket = {
    join: jest.fn(),
  };
  
  // Mock IO object
  const mockIO = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (getPlayerSocket as jest.Mock).mockReturnValue(mockOpponentSocket);
    (ioHandler.getIO as jest.Mock).mockReturnValue(mockIO);
  });
  
  it('should register player socket and find opponent', async () => {
    // Mock findMatchOrQueue to return an opponent
    (findMatchOrQueue as jest.Mock).mockReturnValue(testOpponentUsername);
    // Mock newMatch to return a match ID
    (newMatch as jest.Mock).mockReturnValue(testMatchId);
    
    const result = await requestMatch(mockSocket as any, testUsername);
    
    // Verify socket registration
    expect(registerPlayerSocket).toHaveBeenCalledWith(testUsername, mockSocket);
    
    // Verify match was requested
    expect(findMatchOrQueue).toHaveBeenCalledWith(testUsername);
    
    // Verify match was created
    expect(newMatch).toHaveBeenCalledWith(testUsername, testOpponentUsername, expect.any(Date));
    
    // Verify sockets joined the room
    expect(mockSocket.join).toHaveBeenCalledWith(testMatchId);
    expect(mockOpponentSocket.join).toHaveBeenCalledWith(testMatchId);
    
    // Verify events were emitted
    expect(emitUsername).toHaveBeenCalledWith(testUsername, 'matchFound', testMatchId);
    expect(emitUsername).toHaveBeenCalledWith(testOpponentUsername, 'matchFound', testMatchId);
    
    // Verify matchStart event
    expect(mockIO.to).toHaveBeenCalledWith(testMatchId);
    expect(mockIO.emit).toHaveBeenCalledWith('matchStart', testMatchId);
    
    // Verify return value
    expect(result).toBe(testMatchId);
  });
  
  it('should return undefined when no opponent is found', async () => {
    // Mock findMatchOrQueue to return undefined (no opponent found)
    (findMatchOrQueue as jest.Mock).mockReturnValue(undefined);
    
    const result = await requestMatch(mockSocket as any, testUsername);
    
    // Verify socket registration
    expect(registerPlayerSocket).toHaveBeenCalledWith(testUsername, mockSocket);
    
    // Verify match was requested
    expect(findMatchOrQueue).toHaveBeenCalledWith(testUsername);
    
    // Verify match was NOT created
    expect(newMatch).not.toHaveBeenCalled();
    
    // Verify sockets did NOT join any room
    expect(mockSocket.join).not.toHaveBeenCalled();
    expect(mockOpponentSocket.join).not.toHaveBeenCalled();
    
    // Verify events were NOT emitted
    expect(emitUsername).not.toHaveBeenCalled();
    
    // Verify matchStart event was NOT emitted
    expect(mockIO.to).not.toHaveBeenCalled();
    expect(mockIO.emit).not.toHaveBeenCalled();
    
    // Verify return value
    expect(result).toBeUndefined();
  });
});