import { Socket } from 'socket.io';
import * as ioHandler from '../sockets/socket';
import { match } from './match';
import { authMatchmaking } from './matchmaking';
import { account } from './account';
import { disconnect } from '../sockets/disconnect';
import { leaderboard } from './leaderboard';

export const auth = async (socket: Socket) => {
  console.log('User connected to auth');

  socket.on('disconnect', async () => {
    await disconnect(socket);
  });

  match(socket);
  authMatchmaking(socket);
  account(socket);
  leaderboard(socket);
};

export const emitToRoom = (room: string, event: string, ...data: any[]) => {
  const io = ioHandler.getIO();
  io.to(room).emit(event, ...data);
};
