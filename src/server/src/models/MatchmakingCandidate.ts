export interface MatchmakingCandidate {
  get playerId(): string;
  get rating(): number;
  get requestTime(): Date;
}

export class MatchmakingCandidateFactory {
  public static create = (
    playerId: string,
    rating: number,
    requestTime: Date,
  ): MatchmakingCandidate =>
    new MatchmakingCandidateImpl(playerId, rating, requestTime);
}

class MatchmakingCandidateImpl implements MatchmakingCandidate {
  private _playerId: string;
  private _rating: number;
  private _requestTime: Date;

  constructor(playerId: string, rating: number, requestTime: Date) {
    this._playerId = playerId;
    this._rating = rating;
    this._requestTime = requestTime;
  }

  get playerId(): string {
    return this._playerId;
  }

  get rating(): number {
    return this._rating;
  }

  get requestTime(): Date {
    return this._requestTime;
  }
}
