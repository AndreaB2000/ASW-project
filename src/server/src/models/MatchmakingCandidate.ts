export interface MatchmakingCandidate {
  get username(): string;
  get requestTime(): Date;
}

export class MatchmakingCandidateFactory {
  public static create = (username: string, requestTime: Date): MatchmakingCandidate =>
    new MatchmakingCandidateImpl(username, requestTime);
}

class MatchmakingCandidateImpl implements MatchmakingCandidate {
  private _username: string;
  private _requestTime: Date;

  constructor(playerId: string, requestTime: Date) {
    this._username = playerId;
    this._requestTime = requestTime;
  }

  get username(): string {
    return this._username;
  }

  get requestTime(): Date {
    return this._requestTime;
  }
}
