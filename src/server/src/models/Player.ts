export interface Player {
    /**
     * The unique identifier for the player.
     */
    get username(): string;
}

/**
 * Player factory. Creates a new account with the given username
 * @param username the username of the user
 * @returns {Player} the player object
 */
export const create = (username: string): Player =>
    new PlayerImpl(username);

class PlayerImpl implements Player {
    private _username: string;

    constructor(username: string) {
        this._username = username;
    }

    get username(): string {
        return this._username;
    }

}