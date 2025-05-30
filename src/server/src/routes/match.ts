import { Socket } from 'socket.io/dist';
import * as matchController from '../controllers/match';
import * as matchService from '../services/match';
import { MoveFactory } from '../models/Move';

export const match = (socket: Socket) => {
  socket.on('getMatch', async (matchId, callback) => {
    try {
      const match = await matchService.getMatch(matchId);
      callback(null, match);
    } catch (error) {
      callback(error, null);
    }
  });

  socket.on('addMove', async (matchId: string, movingPlayer: string, x: number, y: number) => {
    if (socket.rooms.has(matchId)) {
      await matchController.addMove(matchId, movingPlayer, MoveFactory.create(x, y));
    }
  });
};
