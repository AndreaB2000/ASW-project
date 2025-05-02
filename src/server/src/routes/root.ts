import { Socket } from 'socket.io';
import * as ioHandler from '../sockets/socket';
import * as matchService from '../services/match';
import * as moveFactory from '../models/Move';

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
};

const match = (socket: Socket) => {
  // If this is out of the function, io is null
  const io = ioHandler.getIO();

  socket.on('matchmaking', async () => {
    console.log('User is joining match');

    // Add player to the queue
    socket.join(QUEUE_ROOM);

    // Start match if two players are in queue
    if (io.sockets.adapter.rooms.get(QUEUE_ROOM).size == 2) {
      console.log('There are 2 players in the queue: creating match');

      // Create the match getting its ID
      console.log('Creating new match');
      const matchId: string = await matchService.newMatch('player1', 'player2', new Date());

      // Remove sockets from queue and add them to the new match room
      // (now it affects all sockets in the queue, in the future only
      // the two involved in the new match will be moved)
      console.log(`Moving sockets in match room (${matchId})`);
      (await io.in(QUEUE_ROOM).fetchSockets()).forEach(s => {
        s.leave(QUEUE_ROOM);
        s.join(matchId);
      });

      // Sending matchStart message
      console.log('Sending matchStart message');
      io.to(matchId).emit('matchStart', matchId);
    }
  });

  socket.on('getMatch', async (matchId, callback) => {
    try {
      const match = await matchService.getMatch(matchId);
      callback(null, match);
    } catch (error) {
      callback(error, null);
    }
  });

  socket.on('addMove', async (matchId: string, movingPlayer: string, x: number, y: number) => {
    const success = await matchService.addMove(matchId, movingPlayer, moveFactory.create(x, y));
    if (success) {
      io.to(matchId).emit('move', movingPlayer, x, y);
      const winner = (await matchService.getMatch(matchId)).winner;
      if (winner) {
        io.to(matchId).emit('ended', winner);
      }
    }
  });
};
