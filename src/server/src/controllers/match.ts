import { Move } from '../models/Move';
import * as matchService from '../services/match';
import * as ratingService from '../services/rating';
import * as accountService from '../services/account';
import { GameResult } from '../services/rating';
import * as ioHandler from '../sockets/socket';
import { RatingFactory } from '../models/Rating';
import { roundToDecimal } from '../utils/round';

export const addMove = async (matchId: string, movingPlayer: string, move: Move): Promise<void> => {
  await matchService.addMove(matchId, movingPlayer, move).then(async success => {
    if (success) {
      ioHandler.emitToRoom(matchId, 'move', movingPlayer, move.x, move.y);
      await matchService.getMatch(matchId).then(async match => {
        if (match.winner != null && match.player2 != 'bot') {
          // Get new ratings
          const player1Rating = await ratingService.getPlayerRating(match.player1);
          const player2Rating = await ratingService.getPlayerRating(match.player2);
          const ratings: [number, number] = ratingService.getNewRating(
            player1Rating,
            player2Rating,
            match.winner == match.player1 ? GameResult.WinA : GameResult.WinB,
          );

          // Calculate rating delta and save match
          const ratingDelta: number = roundToDecimal(Math.abs(ratings[0] - player1Rating), 1);
          await matchService.saveMatch(matchId, ratingDelta);

          // Update ratings
          const success: boolean =
            (await accountService.updateRating(
              await accountService.getAccount(match.player1),
              RatingFactory.create(ratings[0]),
            )) &&
            (await accountService.updateRating(
              await accountService.getAccount(match.player2),
              RatingFactory.create(ratings[1]),
            ));
          if (!success) {
            console.error('Error updating ratings');
          }

          ioHandler.emitToRoom(matchId, 'over', match.winner);
          ioHandler.socketsLeave(matchId);
        }
      });
    }
  });
};
