import { Server } from 'socket.io';

export const registerSocketHandlers = (io: Server): void => {
  io.on('connection', socket => {
    console.log('User connected');

    socket.on('message', msg => {
      console.log(`Message received: ${msg}`);
      socket.emit('reply', msg);
    });
  });
};
