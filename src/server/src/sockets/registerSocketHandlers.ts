import { Server } from 'socket.io';
import { root } from '../routes/root';
import { auth } from '../routes/auth';
import { authenticateTokenSocket } from '../middlewares/auth';

export const registerSocketHandlers = (io: Server): void => {
  io.on('connection', root);
  const authNamespace = io.of('/auth');
  authNamespace.use(authenticateTokenSocket);
  authNamespace.on('connection', auth);
};
