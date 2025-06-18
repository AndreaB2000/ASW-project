import { Socket } from 'socket.io';
import { match } from './match';
import { authMatchmaking } from './matchmaking';
import { account } from './account';
import { disconnect } from '../sockets/disconnect';
import { leaderboard } from './leaderboard';
import { rating } from './rating';

export const auth = async (socket: Socket) => {
  console.log('User connected to auth');

  socket.on('disconnect', async () => {
    await disconnect(socket);
  });

  match(socket);
  authMatchmaking(socket);
  account(socket);
  leaderboard(socket);
  rating(socket);
};
