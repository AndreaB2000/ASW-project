import { Match } from '../models/Match';

const matchesInProgress = new Map<string, Match>();

function getFreshId(): string {
  const lunghezza = 8;
  let keyCandidate: string;

  do {
    const keyNumber = Math.floor(Math.random() * 0xffffffff);
    keyCandidate = keyNumber.toString(16).padStart(lunghezza, '0').slice(-lunghezza);
  } while (matchesInProgress.has(keyCandidate));

  return keyCandidate;
}

export const createMatch = async (match: Match): Promise<string> => {
  const newMatchId = getFreshId();
  matchesInProgress.set(newMatchId, match);
  return newMatchId;
};

export const findMatch = async (matchId: string): Promise<Match | null> => {
  const match = matchesInProgress.get(matchId);
  return match ? structuredClone(match) : null;
};

// Maybe it can return a boolean representing the effectiveness of the update?
export const updateMatch = async (matchId: string, newMatch: Match): Promise<void> => {
  if (matchesInProgress.has(matchId)) {
    matchesInProgress.set(matchId, newMatch);
  }
};

export const deleteMatch = async (matchId: string): Promise<boolean> => {
  return matchesInProgress.delete(matchId);
};
