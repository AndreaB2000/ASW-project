import { findMatchOrQueue } from '../services/matchmaking/matchmaking';
import { emitUsername } from '../routes/root'
import { newMatch } from '../services/match';

export const requestMatch = async (username: string): Promise<string | undefined> => {
    const opponentUsername = await findMatchOrQueue(username);
    if (opponentUsername) {
        const matchId = await newMatch(username, opponentUsername, new Date());
        emitUsername(username, 'matchFound', matchId);
        return matchId;
    }
    return undefined;
};