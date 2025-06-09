import { Move } from '../models/Move';
import * as matchService from '../services/match';
import * as ioHandler from '../sockets/socket';

export const addMove = async (matchId: string, movingPlayer: string, move: Move): Promise<void> => {
  await matchService.addMove(matchId, movingPlayer, move).then(async success => {
    if (success) {
      ioHandler.emitToRoom(matchId, 'move', movingPlayer, move.x, move.y);
      await matchService.getMatch(matchId).then(match => {
        if (match.winner) {
          ioHandler.emitToRoom(matchId, 'over', match.winner);
          console.log('before socketsLeave', ioHandler.getIO().of('/auth').adapter.rooms.keys());
          ioHandler.socketsLeave(matchId);
          console.log('after socketsLeave', ioHandler.getIO().of('/auth').adapter.rooms.keys());
        }
      });
    }
  });
};
