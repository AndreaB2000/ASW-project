import { Socket } from 'socket.io';
import { requestMatch, requestMatchWithBot } from '../controllers/matchmaking';
import { getPlayerSockets } from '../sockets/socket';

export const authMatchmaking = (socket: Socket) => {
  socket.on('requestMatch', async data => {
    await requestMatch(socket, socket.data.username);
  });

  socket.on('requestMatchWithBot', async data => {
    await requestMatchWithBot(socket, socket.data.username);
  });
};

export const guestMatchmaking = (socket: Socket) => {
  socket.on('requestMatch', async data => {
    let guestUsername: string = socket.data.guestUsername;
    if (!guestUsername) {
      guestUsername = setGuestUsername(socket);
    }
    await requestMatch(socket, guestUsername);
  });

  socket.on('requestMatchWithBot', async data => {
    let guestUsername: string = socket.data.guestUsername;
    if (!guestUsername) {
      guestUsername = setGuestUsername(socket);
    }
    await requestMatchWithBot(socket, guestUsername);
  });
};

const setGuestUsername = (socket: Socket): string => {
  let guestUsername: string;
  if (!socket.data.guestUsername) {
    guestUsername = getGuestUsername(socket, 0);
    socket.data.username = guestUsername;
  }
  return guestUsername;
};

const getGuestUsername = (socket: Socket, postfix: number) => {
  const candidateUsername = postfix === 0 ? `guest-${socket.id}` : `guest-${socket.id}-${postfix}`;
  if (getPlayerSockets().has(candidateUsername)) {
    // Username exists, try next postfix
    return getGuestUsername(socket, postfix + 1);
  } else {
    // Username is available
    return candidateUsername;
  }
};
