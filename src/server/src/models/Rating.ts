export interface Rating {
  /**
   * Exposes the rating value for comparisons.
   */
  valueOf(): number;

  /**
   * The rating value.
   * @returns {number} the rating value
   */
  get value(): number;

  /**
   * The deviation value.
   * @returns {number} the deviation value
   */
  get deviation(): number;

  /**
   * The volatility value.
   * @returns {number} the volatility value
   */
  get volatility(): number;
}

export class RatingFactory {
  /**
   * Creates a new rating with the given rating, deviation and volatility.
   * @param rating the rating value.
   * @param deviation the deviation value.
   * @param volatility the volatility value.
   * @returns the rating object.
   */
  public static create = (rating: number, deviation: number, volatility: number): Rating =>
    new GlickoRating(rating, deviation, volatility);
}

class GlickoRating implements Rating {
  private _value: number;
  private _deviation: number;
  private _volatility: number;

  constructor(value: number, deviation: number, volatility: number) {
    this._value = value;
    this._deviation = deviation;
    this._volatility = volatility;
  }

  public valueOf(): number {
    return this._value;
  }

  get value(): number {
    return this._value;
  }

  get deviation(): number {
    return this._deviation;
  }

  get volatility(): number {
    return this._volatility;
  }
}
