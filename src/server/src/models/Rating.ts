export interface Rating {
    higherThan(): boolean;
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

    higherThan(): boolean {
        return true;
    }
}