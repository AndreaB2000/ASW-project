import { Socket } from 'socket.io';
import * as ioHandler from '../sockets/socket';
import * as matchService from '../services/match';
import * as moveFactory from '../models/Move';
import { requestMatch } from '../controllers/matchmaking';
import { getPlayerSocket } from '../sockets/socket';

const QUEUE_ROOM = 'queue';

export const root = (socket: Socket) => {
  // If this is out of the function, io is null
  const io = ioHandler.getIO();

  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('ping', callback => {
    callback('pong from root');
  });

  match(socket);
  matchmaking(socket);
};

const match = (socket: Socket) => {
  // If this is out of the function, io is null
  const io = ioHandler.getIO();

  socket.on('getMatch', async (matchId, callback) => {
    try {
      const match = await matchService.getMatch(matchId);
      callback(null, match);
    } catch (error) {
      callback(error, null);
    }
  });

  socket.on('addMove', async (matchId: string, movingPlayer: string, x: number, y: number) => {
    await matchService
      .addMove(matchId, movingPlayer, moveFactory.create(x, y))
      .then(async success => {
        if (success) {
          io.to(matchId).emit('move', movingPlayer, x, y);
          await matchService.getMatch(matchId).then(match => {
            if (match.winner) {
              io.to(matchId).emit('over', match.winner);
            }
          });
        }
      });
  });
};


const matchmaking = (socket: Socket) => {
  socket.on('requestMatch', async (data) => {
    console.log('Requesting match with data:', data);
    await requestMatch(socket, data.username);
  });
};

export const emitUsername = (username: string, event: string, data: any) => {
  getPlayerSocket(username)?.emit(event, data);
}
