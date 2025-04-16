export interface MatchmakingCandidate {
  get username(): string;
  get requestTime(): Date;
}

export class MatchmakingCandidateFactory {
  public static create = (playerId: string, requestTime: Date): MatchmakingCandidate =>
    new MatchmakingCandidateImpl(playerId, requestTime);
}

class MatchmakingCandidateImpl implements MatchmakingCandidate {
  private _playerId: string;
  private _requestTime: Date;

  constructor(playerId: string, requestTime: Date) {
    this._playerId = playerId;
    this._requestTime = requestTime;
  }

  get username(): string {
    return this._playerId;
  }

  get requestTime(): Date {
    return this._requestTime;
  }
}
