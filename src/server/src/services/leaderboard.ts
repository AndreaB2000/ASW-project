import { readAllAccounts } from "../repositories/account";

/**
 * Get the leaderboard of the top 5 accounts sorted by rating and name.
 * @returns the sorted leaderboard of accounts.
 */
export const getTop5 = async () => {
    const leaderboard = await getLeaderboard();
    return leaderboard.slice(0, 5).map(account => ({
        username: account.username,
        rating: account.rating,
    }));
};

/**
 * Get the ranking of a account in the leaderboard.
 * @param username the username of the account.
 * @returns the ranking of the account in the leaderboard.
 */
export const getAccountRanking = async (username: string): Promise<number> => {
    const leaderboard = await getLeaderboard();
    return leaderboard.findIndex(account => account.username === username);
};

/**
 * Get the leaderboard of accounts sorted by rating and name.
 * @returns the sorted leaderboard of accounts.
 */
const getLeaderboard = async () => {
  const accounts = await readAllAccounts();
  return accounts.sort((a, b) => {
    // sort by rating in descending order
    if (a.rating > b.rating) return -1;
    if (a.rating < b.rating) return 1;
    // if ratings are equal, sort by name in ascending order
    if (a.username < b.username) return -1;
    if (a.username > b.username) return 1;
    return 0;
  });
}