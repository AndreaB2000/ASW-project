import mongoose from 'mongoose';
import { Match, MatchFactory } from '../models/Match';

export class MatchRepository {
  constructor() {}

  async createMatch(match: Match, matchId?: string): Promise<string> {
    const dbmatch = new DBMatch({
      _id: matchId,
      player1: match.player1,
      player2: match.player2,
      creationDate: match.creationDate,
      initialState: match.initialState,
      moves: match.moves,
      ratingDelta: match.ratingDelta,
    });
    return (await dbmatch.save())._id.toString();
  }

  async findMatch(matchId: string): Promise<Match | null> {
    const match = await DBMatch.findById(matchId);
    if (match) {
      return MatchFactory.createFromObject(match);
    } else {
      return null;
    }
  }

  async findMatchesByPlayer(player: string): Promise<string[]> {
    const matches = await DBMatch.find({
      $or: [{ player1: player }, { player2: player }],
    });
    return matches
      .sort((a, b) => {
        return b.creationDate.getTime() - a.creationDate.getTime();
      })
      .map(match => match._id.toString());
  }

  async updateMatch(matchId: string, newMatch: Match): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      throw new Error(`Invalid matchId: ${matchId}`);
    }

    const result = await DBMatch.findOneAndUpdate(
      { _id: matchId },
      { $set: newMatch },
      {
        new: true,
        upsert: false,
        runValidators: true,
      },
    );

    if (!result) {
      throw new Error(`Match ${matchId} not found or update failed`);
    }
  }

  async deleteMatch(matchId: string): Promise<boolean> {
    return (
      (await DBMatch.deleteOne({ _id: new mongoose.Types.ObjectId(matchId) })).deletedCount > 0
    );
  }
}

// Mongoose schemas

const pileSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  numberOfGrains: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cellSchema = new mongoose.Schema({
  pile: {
    type: pileSchema,
    required: false,
    default: null,
  },
});

const boardSchema = new mongoose.Schema({
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  state: [[cellSchema]],
});

const matchSchema = new mongoose.Schema({
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  creationDate: { type: Date, required: true, default: Date.now },
  initialState: { type: boardSchema, required: true },
  moves: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  ],
  ratingDelta: { type: Number, default: null },
});

export const DBMatch = mongoose.model<Match>('Match', matchSchema);
