import { Socket } from 'socket.io/dist';
import { getTopAccounts } from '../services/leaderboard';

export const leaderboard = (socket: Socket) => {
  socket.on('getTopPlayers', async (callback: (accounts: string) => void) => {
    const accounts = await getTopAccounts(5);
    callback(JSON.stringify(accounts));
    console.log('Top players sent to client:', accounts);
  });
};
