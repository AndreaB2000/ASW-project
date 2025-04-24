import { Socket } from 'socket.io';

export const root = (socket: Socket) => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('ping', callback => {
    callback('pong from root');
  });
};
