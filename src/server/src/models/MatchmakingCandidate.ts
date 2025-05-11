import { Rating } from "./Rating";

export interface MatchmakingCandidate {
  get username(): string;
  get rating(): Rating;
  get requestTime(): Date;
}

export class MatchmakingCandidateFactory {
  public static create = (username: string, rating: Rating, requestTime?: Date): MatchmakingCandidate =>
    new MatchmakingCandidateImpl(username, rating, requestTime);
}

class MatchmakingCandidateImpl implements MatchmakingCandidate {
  private _username: string;
  private _rating: Rating;
  private _requestTime: Date;

  constructor(username: string, rating: Rating, requestTime?: Date) {
    this._username = username;
    this._rating = rating;
    this._requestTime = requestTime ?? new Date();
  }

  get username(): string {
    return this._username;
  }

  get rating(): Rating {
    return this._rating;
  }

  get requestTime(): Date {
    return this._requestTime;
  }
}
