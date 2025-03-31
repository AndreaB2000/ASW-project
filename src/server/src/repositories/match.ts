import mongoose, { Schema } from 'mongoose';

export const createMatch = async (
  player1: string,
  player2: string,
  creationDate: Date,
): Promise<string> => {
  const match = new DBMatch({ player1, player2, creationDate });
  return (await match.save())._id.toString();
};

export const findMatch = async (matchId: string): Promise<Match> => {
  const match = await DBMatch.findById(matchId);
  return match as Match;
};

const MatchSchema = new Schema<Match>({
  id: { type: String, required: true },
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  creationDate: { type: Date, required: true, default: Date.now },
  moves: { type: [Move], required: true, default: [] },
});

const DBMatch = mongoose.model('Match', MatchSchema);
