import { findMatch } from '../services/matchmaking/matchmaking';
import { emitUsername } from '../routes/root';
import { getPlayerSocket, registerPlayerSocket } from '../sockets/socket';
import { Socket } from 'socket.io';

export const requestMatch = async (
  playerSocket: Socket,
  username: string,
): Promise<string | undefined> => {
  registerPlayerSocket(username, playerSocket);

  const result = await findMatch(username);

  if (!result) {
    return undefined;
  }

  const [usernameA, usernameB, matchId] = result;
  notifyNewMatch(usernameA, usernameB, matchId);

  return matchId;
};

// TODO: MOVE THIS TO MATCH CONTROLLER
export const notifyNewMatch = async (
  usernameA: string,
  usernameB: string,
  matchId: string,
): Promise<void> => {
  [usernameA, usernameB].forEach(username => {
    const socket = getPlayerSocket(username);
    socket.join(matchId);
    emitUsername(username, 'matchFound', matchId);
  });
};
