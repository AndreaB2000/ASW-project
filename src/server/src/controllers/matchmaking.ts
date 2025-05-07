import { findMatchOrQueue } from '../services/matchmaking/matchmaking';
import { emitUsername } from '../routes/root'
import { newMatch } from '../services/match';
import { getPlayerSocket, registerPlayerSocket } from '../sockets/socket';
import { Socket } from 'socket.io';
import * as ioHandler from '../sockets/socket';

export const requestMatch = async (playerSocket: Socket, username: string): Promise<string | undefined> => {
    // If this is out of the function, io is null TODO REMOVE THIS SHOULD NOW BE NECESSARY
    const io = ioHandler.getIO();

    registerPlayerSocket(username, playerSocket);

    const opponentUsername = await findMatchOrQueue(username);
    if (opponentUsername) {
        const matchId = await newMatch(username, opponentUsername, new Date());

        // add players to room with matchId
        playerSocket.join(matchId);
        getPlayerSocket(opponentUsername).join(matchId);

        // sending matchId to players
        emitUsername(username, 'matchFound', matchId);
        emitUsername(opponentUsername, 'matchFound', matchId);

        // this will not be necessary TODO REMOVE
        io.to(matchId).emit('matchStart', matchId);

        return matchId;
    }
    return undefined;
};