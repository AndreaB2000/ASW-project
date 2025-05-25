import { Socket } from 'socket.io';
import { requestMatch, requestMatchWithBot } from '../controllers/matchmaking';

export const authMatchmaking = (socket: Socket) => {
  socket.on('requestMatch', async data => {
    console.log('Requesting match');
    await requestMatch(socket);
  });

  socket.on('requestMatchWithBot', async data => {
    console.log('Requesting match with bot');
    await requestMatchWithBot(socket);
  });
};

export const guestMatchmaking = (socket: Socket) => {
  socket.on('requestMatch', async data => {
    console.log('Requesting match as guest');
    await requestMatch(socket);
  });

  socket.on('requestMatchWithBot', async data => {
    console.log('Requesting match with bot as guest');
    await requestMatchWithBot(socket);
  });
};
