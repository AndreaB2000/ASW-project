import * as matchFactory from '../models/Match';
import { Match } from '../models/Match';
import { Move } from '../models/Move';
import * as repository from '../repositories/match';

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

  // Checks
  if (true) {
    return match.addMove(newMove);
  }
};

export const getMatch = async (matchId: string): Promise<Match> => {
  return repository.findMatch(matchId);
};
