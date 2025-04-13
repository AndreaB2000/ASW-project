import mongoose from 'mongoose';
import { Match } from '../models/Match';
import { DBMatch } from './endedMatch';

export const createMatch = async (match: Match): Promise<string> => {
  const dbmatch = new DBMatch({
    player1: match.player1,
    player2: match.player2,
    creationDate: match.creationDate,
    moves: [],
  });
  return (await dbmatch.save())._id.toString();
};

export const findMatch = async (matchId: string): Promise<Match | null> => {
  return await DBMatch.findById(matchId);
};

export const findMatchesByPlayer = async (player: string): Promise<string[]> => {
  const matches = await DBMatch.find({
    $or: [{ player1: player }, { player2: player }],
  });
  return matches.map(match => match._id.toString());
};

// Maybe it can return a boolean representing the effectiveness of the update?
export const updateMatch = async (matchId: string, newMatch: Match): Promise<void> => {
  await DBMatch.findOneAndUpdate({ matchId }, newMatch);
};

export const deleteMatch = async (matchId: string): Promise<boolean> => {
  return (await DBMatch.deleteOne({ matchId })).deletedCount > 0;
};
