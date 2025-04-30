import mongoose from 'mongoose';
import { Match } from '../models/Match';
import * as matchFactory from '../models/Match';

export class MatchRepository {
  constructor() {}

  async createMatch(match: Match): Promise<string> {
    const dbmatch = new DBMatch({
      player1: match.player1,
      player2: match.player2,
      creationDate: match.creationDate,
      initialState: match.initialState,
      moves: [],
    });
    return (await dbmatch.save())._id.toString();
  }

  async findMatch(matchId: string): Promise<Match | null> {
    return matchFactory.createFromObject(await DBMatch.findById(matchId));
  }

  async findMatchesByPlayer(player: string): Promise<string[]> {
    const matches = await DBMatch.find({
      $or: [{ player1: player }, { player2: player }],
    });
    return matches.map(match => match._id.toString());
  }

  async updateMatch(matchId: string, newMatch: Match): Promise<void> {
    await DBMatch.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(matchId) }, newMatch);
  }

  async deleteMatch(matchId: string): Promise<boolean> {
    return (await DBMatch.deleteOne({ matchId })).deletedCount > 0;
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
});

export const DBMatch = mongoose.model<Match>('Match', matchSchema);
