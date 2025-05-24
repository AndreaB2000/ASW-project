import { Socket } from 'socket.io';

export const matchmaking = (socket: Socket) => {
  socket.on('requestMatch', async () => {
    console.log('Requesting match');
    await socket.data.strategy.findMatch(socket);
  });

  socket.on('requestMatchWithBot', async () => {
    console.log('Requesting match with bot');
    await socket.data.strategy.findMatchWithBot(socket);
  });
};