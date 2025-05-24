import { Socket } from 'socket.io';
import * as ioHandler from '../sockets/socket';
import { match } from './match';
import { matchmaking } from './matchmaking';
import { authenticateTokenSocket } from '../middlewares/auth';

export const root = (socket: Socket) => {
  console.log('User connected');

  socket.use((_, next) => {
    authenticateTokenSocket(socket, next);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('ping', callback => {
    callback('pong from root');
  });

  match(socket);
  matchmaking(socket);
};

export const emitToRoom = (room: string, event: string, ...data: any[]) => {
  const io = ioHandler.getIO();
  io.to(room).emit(event, ...data);
};
