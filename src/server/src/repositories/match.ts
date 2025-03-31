import { connect } from 'http2';
import mongoose, { Schema } from 'mongoose';

export async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://172.0.0.12:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    } as mongoose.ConnectOptions);

    console.log('Connesso a MongoDB con Mongoose');
  } catch (err) {
    console.error('Errore di connessione:', err);
    throw err;
  }
}

interface Match {
  player1: string;
  player2: string;
  creationDate: Date;
}

export async function createMatch(player1: string, player2: string, creationDate: Date) {
  connectToDatabase();
  const match = new DBMatch({ player1, player2, creationDate });
  return (await match.save())._id.toString();
}

const MatchSchema = new Schema<Match>({
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  creationDate: { type: Date, required: true },
});

const DBMatch = mongoose.model('Match', MatchSchema);
