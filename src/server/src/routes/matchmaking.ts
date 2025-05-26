import { Socket } from 'socket.io';
import { requestMatch, requestMatchWithBot } from '../controllers/matchmaking';

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
    await requestMatch(socket, guestUsername);
  });

  socket.on('requestMatchWithBot', async data => {
    await requestMatchWithBot(socket, guestUsername);
  });

  const guestUsername = `guest`;
};
