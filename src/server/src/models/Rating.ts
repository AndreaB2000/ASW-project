export interface Rating {
    /**
     * Compares the current rating with another rating. 
     * @param comparedRating true if the current rating is higher than the compared rating.
     * @returns {boolean} true if the current rating is higher than the compared rating.
     */
    higherThan(comparedRating: Rating): boolean;

    /**
     * Exposes the rating value for comparisons.
     */
    valueOf(): number;

    /**
     * The rating value.
     * @returns {number} the rating value
     */
    get rating(): number;

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
    private _rating: number;
    private _deviation: number;
    private _volatility: number;

    constructor(rating: number, deviation: number, volatility: number) {
        this._rating = rating;
        this._deviation = deviation;
        this._volatility = volatility;
    }

    public higherThan(comparedRating: Rating): boolean {
        return this > comparedRating;
    }

    public valueOf(): number {
        return this._rating;
    }

    get rating(): number {
        return this._rating;
    }

    get deviation(): number {
        return this._deviation;
    }

    get volatility(): number {
        return this._volatility;
    }
}