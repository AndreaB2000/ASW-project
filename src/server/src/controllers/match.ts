import { Move } from '../models/Move';
import * as matchService from '../services/match';
import * as ioHandler from '../sockets/socket';

export const addMove = async (matchId: string, movingPlayer: string, move: Move): Promise<void> => {
  const io = ioHandler.getIO();

  await matchService.addMove(matchId, movingPlayer, move).then(async success => {
    if (success) {
      ioHandler.emitToRoom(matchId, 'move', movingPlayer, move.x, move.y);
      await matchService.getMatch(matchId).then(match => {
        if (match.winner) {
          ioHandler.emitToRoom(matchId, 'over', match.winner);
          io.socketsLeave(matchId);
        }
      });
    }
  });
};
