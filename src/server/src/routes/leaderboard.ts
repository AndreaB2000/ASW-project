import { Socket } from 'socket.io/dist';
import { getAccountStats, getTopAccounts } from '../services/leaderboard';

export const leaderboard = (socket: Socket) => {
  socket.on('getTopPlayers', async (callback: (accounts: string) => void) => {
    const accounts = await getTopAccounts(5);
    callback(JSON.stringify(accounts));
  });

  socket.on('getAccountInfo', async (callback: (user: string) => void) => {
    const user = await getAccountStats(socket.data.username);
    callback(JSON.stringify(user));
    console.log('Top players sent to client:', user);
  });
};
