import { Socket } from 'socket.io';
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
