import { Move } from '../models/Move';
import * as matchService from '../services/match';
import { emitToRoom } from '../routes/root';

export const addMove = async (matchId: string, movingPlayer: string, move: Move): Promise<void> => {
  await matchService.addMove(matchId, movingPlayer, move).then(async success => {
    if (success) {
      emitToRoom(matchId, 'move', movingPlayer, move.x, move.y);
      await matchService.getMatch(matchId).then(match => {
        if (match.winner) {
          emitToRoom(matchId, 'over', match.winner);
        }
      });
    }
  });
};
