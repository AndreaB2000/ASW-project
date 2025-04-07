import { Rating } from './Rating';

export interface Player {
  /**
   * The unique identifier for the player.
   */
  get username(): string;

  /**
   * The player's rating.
   */
  get rating(): Rating;
}

export class PlayerFactory {
  /**
   * Creates a new Player with the given username and rating.
   * @param username the username of the user
   * @param rating the rating of the user
   * @returns {Player} the player object
   */
  public static create = (username: string, rating: Rating): Player =>
    new PlayerImpl(username, rating);
}

class PlayerImpl implements Player {
  private _username: string;
  private _rating: Rating;

  constructor(username: string, rating: Rating) {
    this._username = username;
    this._rating = rating;
  }

  get username(): string {
    return this._username;
  }

  get rating(): Rating {
    return this._rating;
  }
}
