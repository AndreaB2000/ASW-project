import mongoose from 'mongoose';
import { Match } from '../models/Match';

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

// Maybe it can return a boolean representing the effectiveness of the update?
export const updateMatch = async (matchId: string, newMatch: Match): Promise<void> => {
  await DBMatch.findOneAndUpdate({ matchId }, newMatch);
};

export const deleteMatch = async (matchId: string): Promise<boolean> => {
  return (await DBMatch.deleteOne({ matchId })).deletedCount > 0;
};

const matchSchema = new mongoose.Schema({
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  creationDate: { type: Date, required: true, default: Date.now },
  moves: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  ],
});

export const DBMatch = mongoose.model<Match>('Match', matchSchema);
