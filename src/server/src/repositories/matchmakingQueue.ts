import mongoose from 'mongoose';
import { MatchmakingCandidate, MatchmakingCandidateFactory } from '../../src/models/MatchmakingCandidate';
import { MatchmakingQueue, MatchmakingQueueFactory } from '../../src/models/MatchmakingQueue';

// Schema for individual matchmaking candidate documents
const candidateSchema = new mongoose.Schema<MatchmakingCandidate>({
  username: { type: String, required: true, unique: true },
  rating: {
    value: { type: Number, required: true },
  },
  requestTime: { type: Date, required: true },
});

// Model for candidate documents
export const DBMatchmakingCandidate = mongoose.model<MatchmakingCandidate>(
  'MatchmakingCandidate',
  candidateSchema,
);

/**
 * Fetches all candidates from the database and constructs a queue
 */
export async function getQueue(): Promise<MatchmakingQueue> {
  const candidates = await DBMatchmakingCandidate.find();
  const queue = MatchmakingQueueFactory.create();

  if (candidates.length === 0) {
    return queue;
  }

  candidates.map(candidate =>
    queue.add(MatchmakingCandidateFactory.create(candidate.username, candidate.rating, candidate.requestTime)));
  return queue;
}

/**
 * Adds a new candidate to the matchmaking system
 */
export async function addCandidate(candidate: MatchmakingCandidate): Promise<void> {
  // Use findOneAndUpdate with upsert to handle the case where the user is already in the queue
  await DBMatchmakingCandidate.findOneAndUpdate(
    { username: candidate.username },
    { $set: { requestTime: candidate.requestTime } },
    { upsert: true },
  );
}

/**
 * Removes a candidate from the matchmaking system
 */
export async function removeCandidate(username: string): Promise<void> {
  await DBMatchmakingCandidate.deleteOne({ username });
}

/**
 * Clears all candidates from the matchmaking system
 */
export async function clearQueue(): Promise<void> {
  await DBMatchmakingCandidate.deleteMany({});
}
