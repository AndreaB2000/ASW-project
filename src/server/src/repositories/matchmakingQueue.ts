import mongoose from 'mongoose';
import {
  MatchmakingCandidate,
  MatchmakingCandidateFactory,
} from '../../src/models/MatchmakingCandidate';
import { MatchmakingQueue, MatchmakingQueueFactory } from '../../src/models/MatchmakingQueue';

const candidateSchema = new mongoose.Schema<MatchmakingCandidate>({
  playerId: { type: String, required: true },
  rating: { type: Number, required: true },
  requestTime: { type: Date, required: true },
});

interface DataMatchmakingQueue {
  candidates: MatchmakingCandidate[];
}

const matchmakingQueueSchema = new mongoose.Schema<DataMatchmakingQueue>({
  candidates: { type: [candidateSchema], default: [] },
});

export const DBMatchmakingQueue: mongoose.Model<DataMatchmakingQueue> = mongoose.model(
  'MatchmakingQueue',
  matchmakingQueueSchema,
);

const UNIQUE_ID = 'singleton';

export async function getQueue(): Promise<MatchmakingQueue> {
  let queue = await DBMatchmakingQueue.findById(UNIQUE_ID).lean();
  if (!queue) {
    queue = await new DBMatchmakingQueue({ _id: UNIQUE_ID, candidates: [] }).save();
  }

  return MatchmakingQueueFactory.create(queue.candidates);
}

export async function addCandidate(candidate: MatchmakingCandidate): Promise<void> {
  await DBMatchmakingQueue.findByIdAndUpdate(
    UNIQUE_ID,
    { $addToSet: { candidates: candidate } },
    { upsert: true },
  );
}

export async function removeCandidate(candidateId: string): Promise<void> {
  await DBMatchmakingQueue.findByIdAndUpdate(UNIQUE_ID, {
    $pull: { candidates: { id: candidateId } },
  });
}

export async function updateCandidate(
  candidateId: string,
  updatedCandidate: MatchmakingCandidate,
): Promise<void> {
  await DBMatchmakingQueue.findByIdAndUpdate(
    UNIQUE_ID,
    { $set: { 'candidates.$[elem]': updatedCandidate } },
    { arrayFilters: [{ 'elem.id': candidateId }] },
  );
}
