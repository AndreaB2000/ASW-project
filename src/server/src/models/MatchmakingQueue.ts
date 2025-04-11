import { MatchmakingCandidate } from './MatchmakingCandidate';

export interface MatchmakingQueue extends Iterable<MatchmakingCandidate> {
  /**
   * Check if the queue is empty.
   * @returns {boolean} - True if the queue is empty, false otherwise.
   */
  empty(): boolean;

  /**
   * Add a candidate to the queue.
   * @param candidate - The candidate to add to the queue.
   * @returns {void}
   */
  add(candidate: MatchmakingCandidate): void;

  /**
   * Get a candidate from the queue by player ID.
   * @param playerId - The ID of the player to get.
   * @returns {MatchmakingCandidate | undefined} - The candidate if player is in queue, undefined otherwise.
   */
  get(playerId: string): MatchmakingCandidate | undefined;

  /**
   * Check if a player is in the queue.
   * @param playerId - The ID of the player to check.
   * @returns {boolean} - True if the player is in the queue, false otherwise.
   */
  has(playerId: string): boolean;

  /**
   * Removes a candidate from the queue.
   * @param playerId - The ID of the player to remove.
   */
  remove(playerId: string): void;

  /**
   * Get the number of candidates in the queue.
   * @returns {number} - The number of candidates in the queue.
   */
  get size(): number;
}

export class MatchmakingQueueFactory {
  public static create = (): MatchmakingQueue => new MatchmakingQueueImpl();
}

class MatchmakingQueueImpl implements MatchmakingQueue {

  private _candidates: Map<string, MatchmakingCandidate> = new Map();

  public empty(): boolean {
    return this._candidates.size === 0;
  }

  public add(candidate: MatchmakingCandidate): void {
    this._candidates.set(candidate.playerId, candidate);
  }

  get(playerId: string): MatchmakingCandidate | undefined {
    return this._candidates.get(playerId);
  }

  has(playerId: string): boolean {
    return this._candidates.has(playerId);
  }

  remove(playerId: string): void {
    this._candidates.delete(playerId);
  }

  public get size(): number {
    return this._candidates.size;
  }

  [Symbol.iterator](): Iterator<MatchmakingCandidate> {
    return this._candidates.values();
  }
}
