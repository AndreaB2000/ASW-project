import { readAllPlayers } from "../repositories/player";

/**
 * Get the leaderboard of the top 5 players sorted by rating and name.
 * @returns the sorted leaderboard of players.
 */
export const getTop5 = async () => {
    const leaderboard = await getLeaderboard();
    return leaderboard.slice(0, 5).map(player => ({
        username: player.username,
        rating: player.rating,
    }));
};

/**
 * Get the ranking of a player in the leaderboard.
 * @param username the username of the player.
 * @returns the ranking of the player in the leaderboard.
 */
export const getPlayerRanking = async (username: string): Promise<number> => {
    const leaderboard = await getLeaderboard();
    return leaderboard.findIndex(player => player.username === username);
};

/**
 * Get the leaderboard of players sorted by rating and name.
 * @returns the sorted leaderboard of players.
 */
const getLeaderboard = async () => {
  const players = await readAllPlayers();
  return players.sort((a, b) => {
    // sort by rating in descending order
    if (a.rating > b.rating) return -1;
    if (a.rating < b.rating) return 1;
    // if ratings are equal, sort by name in ascending order
    if (a.username < b.username) return -1;
    if (a.username > b.username) return 1;
    return 0;
  });
}