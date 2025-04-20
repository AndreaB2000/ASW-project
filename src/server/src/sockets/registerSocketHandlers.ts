import { Server } from 'socket.io';

export const registerSocketHandlers = (io: Server): void => {
  io.on('connection', socket => {
    console.log('User connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
    socket.on('ping', () => {
      console.log('Ping received');
      console.log('Pong sent');
      socket.emit('pong');
    });
  });
};
