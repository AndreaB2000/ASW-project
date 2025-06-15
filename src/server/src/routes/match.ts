import { Socket } from 'socket.io/dist';
import * as matchController from '../controllers/match';
import * as matchService from '../services/match';
import { Move, MoveFactory } from '../models/Move';
import * as ioHandler from '../sockets/socket';
import * as botService from '../services/bot';

export const match = (socket: Socket) => {
  async function addMove(matchId: string, movingPlayer: string, x: number, y: number) {
    if (socket.rooms.has(matchId)) {
      await matchController.addMove(matchId, movingPlayer, MoveFactory.create(x, y));
    }
  }

  socket.on('getMatch', async (matchId, callback) => {
    try {
      const match = await matchService.getMatch(matchId);
      const socketUsername = ioHandler.getSocketUsername(socket);
      callback(null, { ...match, winner: match.winner }, match.player1 == socketUsername ? 1 : 2);
    } catch (error) {
      callback(error, null, null);
    }
  });

  socket.on('addMove', async (matchId: string, movingPlayer: string, x: number, y: number) => {
    addMove(matchId, movingPlayer, x, y);
    const match = await matchService.getMatch(matchId);
    console.log(JSON.stringify(match.computeCurrentState()));
    if (match.player2 == 'bot') {
      const botMove: Move = await botService.getMove(match?.computeCurrentState());
      console.log(JSON.stringify(botMove));
      addMove(matchId, 'bot', botMove.x, botMove.y);
    }
  });

  socket.on('matchHistory', async (username: string, callback) => {
    const matchIds: string[] = await matchService.getEndedMatchesByPlayer(username);
    callback(matchIds);
  });
};
