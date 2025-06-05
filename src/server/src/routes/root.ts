import { Socket } from 'socket.io';
import * as ioHandler from '../sockets/socket';
import { match } from './match';
import { guestMatchmaking } from './matchmaking';

export const root = (socket: Socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('Guest disconnected');
  });

  socket.on('ping', callback => {
    callback('pong from root');
  });

  match(socket);
  guestMatchmaking(socket);
};

export const emitToRoom = (room: string, event: string, ...data: any[]) => {
  const io = ioHandler.getIO();
  io.to(room).emit(event, ...data);
};
