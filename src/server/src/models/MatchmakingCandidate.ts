export interface MatchmakingCandidate {
  get playerId(): string;

  get rating(): number;
  get waitingTime(): number;
  get requestTime(): Date;
}

export class MatchmakingCandidateFactory {
  public static create = (
    playerId: string,
    rating: number,
    waitingTime: number,
    requestTime: Date,
  ): MatchmakingCandidate =>
    new MatchmakingCandidateImpl(playerId, rating, waitingTime, requestTime);
}

class MatchmakingCandidateImpl implements MatchmakingCandidate {
  private _playerId: string;
  private _rating: number;
  private _waitingTime: number;
  private _requestTime: Date;

  constructor(playerId: string, rating: number, waitingTime: number, requestTime: Date) {
    this._playerId = playerId;
    this._rating = rating;
    this._waitingTime = waitingTime;
    this._requestTime = requestTime;
  }

  get playerId(): string {
    return this._playerId;
  }

  get rating(): number {
    return this._rating;
  }

  get waitingTime(): number {
    return this._waitingTime;
  }

  get requestTime(): Date {
    return this._requestTime;
  }
}
