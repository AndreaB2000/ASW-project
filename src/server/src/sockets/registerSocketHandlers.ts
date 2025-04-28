import { Server } from 'socket.io';
import { root } from '../routes/root';

export const registerSocketHandlers = (io: Server): void => {
  io.on('connection', root);
};
