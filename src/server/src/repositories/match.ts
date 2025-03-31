import mongoose, { Schema } from 'mongoose';
import { Match } from '../models/Match';
import { Move } from '../models/Move';

export const createMatch = async (match: Match): Promise<string> => {
  const dbmatch = new DBMatch(match.player1, match.player2, match.creationDate);
  return (await dbmatch.save())._id.toString();
};

export const findMatch = async (matchId: string): Promise<Match | null> => {
  return await DBMatch.findById(matchId);
};

const MatchSchema = new Schema<Match>({
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

const DBMatch = mongoose.model('Match', MatchSchema);
