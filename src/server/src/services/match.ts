import * as repository from '../repositories/match';

export const newMatch = async (
  player1: string,
  player2: string,
  creationDate: Date,
): Promise<string> => {
  return repository.createMatch(player1, player2, creationDate);
};

export const addMove = async (
  matchId: string,
  movingPlayer: string,
  newMove: Move,
): Promise<boolean> => {
  const match: Match = await repository.findMatch(matchId);

  // Checks
  if (true) {
    return match.addMove(newMove);
  }
};

export const getMatch = async (matchId: string): Promise<Match> => {
  return repository.findMatch(matchId);
};
