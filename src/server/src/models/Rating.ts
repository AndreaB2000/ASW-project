export interface Rating {
    /**
     * Compares the current rating with another rating. 
     * @param comparedRating true if the current rating is higher than the compared rating.
     */
    higherThan(comparedRating: Rating): boolean;

    /**
     * The rating value.
     */
    get rating(): number;
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

    get rating(): number {
        return this._rating;
    }

    public higherThan(comparedRating: Rating): boolean {
        return this._rating > comparedRating.rating;
    }
}