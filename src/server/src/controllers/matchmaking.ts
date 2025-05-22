import { findMatch } from '../services/matchmaking/matchmaking';
import { getPlayerSocket, registerPlayerSocket } from '../sockets/socket';
import { Socket } from 'socket.io';
import { newMatch } from '../services/match';

/**
 * Requests a match and notifies the player if a match has been found, adds them to the queue otherwise.
 * @param playerSocket the socket of the player requesting the match
 * @param username the username of the player requesting the match
 */
export const requestMatch = async (playerSocket: Socket): Promise<void> => {
  console.log("auth", playerSocket.handshake.auth);
  const username = playerSocket.handshake.auth.account.username;
  registerPlayerSocket(username, playerSocket);

  const result = await findMatch(username);

  if (!result) return;

  const [usernameA, usernameB, matchId] = result;

  notifyNewMatch(usernameA, usernameB, matchId);
};

/**
 * Requests a match with a bot and notifies the player that a match has been found.
 * @param playerSocket the socket of the player requesting the match
 * @param username the username of the player requesting the match
 */
export const requestMatchWithBot = async (
  playerSocket: Socket,
  username: string,
): Promise<string> => {
  registerPlayerSocket(username, playerSocket);
  const matchId = await newMatch(username, 'bot', new Date());
  notifyPlayer(username, matchId);

  return matchId;
};

// TODO: MOVE THIS TO MATCH CONTROLLER
/**
 * Notifies the players that a match has been found and adds them to the match room.
 * @param usernameA the username of the first player
 * @param usernameB the username of the second player
 * @param matchId the id of the match
 */
export const notifyNewMatch = async (
  usernameA: string,
  usernameB: string,
  matchId: string,
): Promise<void> => {
  [usernameA, usernameB].forEach(username => {
    notifyPlayer(username, matchId);
  });
};

/**
 * Notifies the player that a match has been found and adds them to the match room.
 * @param username the username of the player to notify
 * @param matchId the id of the match
 */
const notifyPlayer = async (username: string, matchId: string): Promise<void> => {
  const socket = getPlayerSocket(username);
  if (socket) {
    socket.join(matchId);
    socket.emit('matchFound', matchId);
  }
};
