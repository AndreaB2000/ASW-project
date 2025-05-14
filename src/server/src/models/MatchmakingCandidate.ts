import { Rating } from './Rating';

export interface MatchmakingCandidate {
  /**
   * The username of the candidate.
   */
  get username(): string;

  /**
   * The rating of the candidate.
   */
  get rating(): Rating;

  /**
   * The time when the candidate made the matchmaking request.
   */
  get requestTime(): Date;

  /**
   * Compares this candidate with another candidate.
   * @param other the other candidate to compare with.
   * @return true if the candidates are equal, false otherwise.
   */
  equals(other: MatchmakingCandidate): boolean;
}

export class MatchmakingCandidateFactory {
  public static create = (
    username: string,
    rating: Rating,
    requestTime?: Date,
  ): MatchmakingCandidate => new MatchmakingCandidateImpl(username, rating, requestTime);
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

  //  TODO UPDATE THIS WHEN THE USERS WILL NOT BE IDENTIFIED BY USERNAME
  equals(other: MatchmakingCandidate): boolean {
    return this._username === other.username;
  }
}
