import { Socket } from 'socket.io';
import * as ioHandler from '../sockets/socket';
import { requestMatch, requestMatchWithBot } from '../controllers/matchmaking';
import { match } from './match';

export const root = (socket: Socket) => {
  // io.use(authenticateTokenSocket);

  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('ping', callback => {
    callback('pong from root');
  });

  match(socket);
  matchmaking(socket);
};

const matchmaking = (socket: Socket) => {
  socket.on('requestMatch', async data => {
    console.log('Requesting match with data:', data);
    await requestMatch(socket, data.username);
  });

  socket.on('requestMatchWithBot', async data => {
    console.log('Requesting match with bot with data:', data);
    await requestMatchWithBot(socket, data.username);
  });
};

export const emitToRoom = (room: string, event: string, ...data: any[]) => {
  const io = ioHandler.getIO();
  io.to(room).emit(event, ...data);
};
