import { Socket } from 'socket.io';
import * as ioHandler from '../sockets/socket';
import { match } from './match';
import { authMatchmaking } from './matchmaking';

export const auth = (socket: Socket) => {
  console.log('User connected to auth');

  socket.on('disconnect', () => {
    console.log('User disconnected to auth');
  });

  match(socket);
  authMatchmaking(socket);
};

export const emitToRoom = (room: string, event: string, ...data: any[]) => {
  const io = ioHandler.getIO();
  io.to(room).emit(event, ...data);
};