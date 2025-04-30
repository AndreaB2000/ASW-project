import { Socket } from 'socket.io';
import * as ioHandler from '../sockets/socket';
import * as matchService from '../services/match';

let puppetMatch = { player1: '', player2: '', state: [0, 0], moves: [] as number[] };

const QUEUE_ROOM = 'queue';

export const root = (socket: Socket) => {
  // If this is out of the function, io is null
  const io = ioHandler.getIO();

  console.log('User connected');
  if (puppetMatch.player1 == '') {
    puppetMatch.player1 = 'player1';
  } else {
    puppetMatch.player2 = 'player2';
  }

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
      io.to(matchId).emit('matchStart');
    }
  });

  socket.on('getMatch', callback => {
    callback(puppetMatch);
  });

  socket.on('addMove', data => {
    console.log(data);
  });
};
