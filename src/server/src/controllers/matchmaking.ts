import { findMatchOrQueue } from '../services/matchmaking/matchmaking';
import { emitUsername } from '../routes/root'
import { newMatch } from '../services/match';
import { registerPlayerSocket } from '../sockets/socket';
import { Socket } from 'socket.io';

export const requestMatch = async (playerSocket: Socket, username: string): Promise<string | undefined> => {
    registerPlayerSocket(username, playerSocket);

    const opponentUsername = await findMatchOrQueue(username);
    if (opponentUsername) {
        const matchId = await newMatch(username, opponentUsername, new Date());
        emitUsername(username, 'matchFound', matchId);
        emitUsername(opponentUsername, 'matchFound', matchId);
        return matchId;
    }
    return undefined;
};