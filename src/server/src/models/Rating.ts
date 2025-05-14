export interface Rating {
  /**
   * The rating value.
   * @returns {number} the rating value
   */
  get value(): number;

  /**
   * The rating value.
   * @returns {number} the rating value
   */
  valueOf(): number;
}

export class RatingFactory {
  /**
   * Creates a new rating with the given rating.
   * @param rating the rating value.
   * @returns the rating object.
   */
  public static create = (rating?: number): Rating => new EloRating(rating);
}

const DEFAULT_RATING = 1500;

class EloRating implements Rating {
  private _value: number;

  constructor(value?: number) {
    this._value = value ?? DEFAULT_RATING;
  }

  valueOf(): number {
    return this._value;
  }

  get value(): number {
    return this._value;
  }
}
