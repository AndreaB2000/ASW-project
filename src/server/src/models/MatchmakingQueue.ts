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
   * Get a candidate from the queue by player username.
   * @param username - The username of the player to get.
   * @returns {MatchmakingCandidate | undefined} - The candidate if player is in queue, undefined otherwise.
   */
  get(username: string): MatchmakingCandidate | undefined;

  /**
   * Check if a player is in the queue.
   * @param username - The username of the player to check.
   * @returns {boolean} - True if the player is in the queue, false otherwise.
   */
  has(username: string): boolean;

  /**
   * Removes a candidate from the queue.
   * @param username - The username of the player to remove.
   */
  remove(username: string): void;

  /**
   * Get the number of candidates in the queue.
   * @returns {number} - The number of candidates in the queue.
   */
  get size(): number;
}

export class MatchmakingQueueFactory {
  public static create = (candidates?: MatchmakingCandidate[]): MatchmakingQueue => {
    const queue = new MatchmakingQueueImpl();
    if (candidates) {
      candidates.forEach(candidate => queue.add(candidate));
    }
    return queue;
  };
}

class MatchmakingQueueImpl implements MatchmakingQueue {
  private _candidates: Map<string, MatchmakingCandidate> = new Map();

  public empty(): boolean {
    return this._candidates.size === 0;
  }

  public add(candidate: MatchmakingCandidate): void {
    this._candidates.set(candidate.username, candidate);
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
    const array = Array.from(this._candidates.values());
    const sorted = array.sort((a, b) => a.requestTime.getTime() - b.requestTime.getTime());
    return sorted[Symbol.iterator]();
  }
}
