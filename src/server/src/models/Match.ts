import { Document, Schema, model } from 'mongoose';

interface Pile {
  owner: string;
  grains: number;
}

interface Cell {
  pile?: Pile;
}

export type BoardState = Cell[][];

export interface Move {
  player: string;
  grainPlaced: { x: number; y: number };
  newState: BoardState;
}

export interface MatchDocument extends Document {
  players: string[];
  createdAt: Date;
  initialState: BoardState;
  moves: Move[];
}

const matchSchema = new Schema<MatchDocument>({
  players: {
    type: [String],
    required: true,
    validate: {
      validator: function (players: string[]) {
        return players.length === 2; // There should be exactly 2 players
      },
      message: 'Una partita richiede esattamente due giocatori.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  initialState: {
    type: Schema.Types.Mixed, // Cells matrix
    required: true,
  },
  moves: [
    {
      player: { type: String, required: true },
      grainPlaced: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
      newState: { type: Schema.Types.Mixed, required: true }, // Cells matrix
    },
  ],
});

const Match = model<MatchDocument>('Match', matchSchema);

export default Match;
