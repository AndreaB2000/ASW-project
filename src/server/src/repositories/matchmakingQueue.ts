import mongoose from 'mongoose';
import {
  MatchmakingCandidate,
  MatchmakingCandidateFactory,
} from '../../src/models/MatchmakingCandidate';
import { MatchmakingQueue, MatchmakingQueueFactory } from '../../src/models/MatchmakingQueue';
import { RatingFactory } from '../../src/models/Rating';

// Schema for individual matchmaking candidate documents
const candidateSchema = new mongoose.Schema<MatchmakingCandidate>({
  username: { type: String, required: true, unique: true },
  rating: { type: Number, required: true},
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

  candidates.forEach(candidate => {
    queue.add(
      MatchmakingCandidateFactory.create(
        candidate.username,
        RatingFactory.create(candidate.rating.value),
        candidate.requestTime,
      ),
    )}
  );
  return queue;
}

/**
 * Adds a new candidate to the matchmaking system
 */
export async function addCandidate(candidate: MatchmakingCandidate): Promise<void> {
  // Use findOneAndUpdate with upsert to handle the case where the user is already in the queue
  await DBMatchmakingCandidate.findOneAndUpdate(
    { username: candidate.username },
    { $set: { rating: candidate.rating, requestTime: candidate.requestTime } },
    { upsert: true },
  );
}

/**
 * Removes a candidate from the matchmaking system
 */
export async function removeCandidate(candidate: MatchmakingCandidate): Promise<void> {
  await DBMatchmakingCandidate.deleteOne({ username: candidate.username });
}

/**
 * Clears all candidates from the matchmaking system
 */
export async function clearQueue(): Promise<void> {
  await DBMatchmakingCandidate.deleteMany({});
}

/**
 * Retrieves a candidate by username
 * @param username the username of the candidate to retrieve
 * @returns the MatchmakingCandidate if found, otherwise null
 */
export async function getCandidate(username: string): Promise<MatchmakingCandidate | null> {
  const candidate = await DBMatchmakingCandidate.find({ username });
  if (candidate.length === 0) {
    return null;
  }
  return MatchmakingCandidateFactory.create(
    candidate[0].username,
    RatingFactory.create(candidate[0].rating.value),
    candidate[0].requestTime,
  );
}
