export interface Rating {
    /**
     * Compares the current rating with another rating. 
     * @param comparedRating true if the current rating is higher than the compared rating.
     */
    higherThan(comparedRating: Rating): boolean;

    /**
     * Exposes the rating value for comparisons.
     */
    valueOf(): number;
}

export const create = (rating: number, deviation: number, volatility: number): Rating =>
    new GlickoRating(rating, deviation, volatility);

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
}