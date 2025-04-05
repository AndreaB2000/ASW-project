import * as matchFactory from '../models/Match';
import { Match } from '../models/Match';
import { Move } from '../models/Move';
import * as repository from '../repositories/endedMatch';

export const newMatch = async (
  player1: string,
  player2: string,
  creationDate: Date,
): Promise<string> => {
  const match = matchFactory.create(player1, player2, creationDate);
  return repository.createMatch(match);
};

export const addMove = async (
  matchId: string,
  movingPlayer: string,
  newMove: Move,
): Promise<boolean> => {
  const match: Match = await repository.findMatch(matchId);

  if (
    (movingPlayer == match.player1 && match.moves.length % 2 == 0) ||
    (movingPlayer == match.player2 && match.moves.length % 2 == 1)
  ) {
    return match.addMove(newMove);
  }
};

export const getMatch = async (matchId: string): Promise<Match> => {
  return repository.findMatch(matchId);
};
