import { notifyNewMatch } from '../controllers/matchmaking';
import { findMatch } from '../services/matchmaking/matchmaking';

/**
 */
export const createMatchIfPossible = async () => {
  while (true) {
    const result = await findMatch();
    if (result === undefined) {
      break;
    }

    const [usernameA, usernameB, matchId] = result;
    await notifyNewMatch(usernameA, usernameB, matchId);
  }
};
