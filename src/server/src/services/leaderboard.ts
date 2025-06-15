import { readAllAccounts } from '../repositories/account';
import { readAccountByUsername } from '../repositories/account';

/**
 * Get the leaderboard of the top 5 accounts sorted by rating and name.
 * @returns the sorted leaderboard of accounts.
 */
export const getTopAccounts = async (count: number) => {
  const leaderboard = await getLeaderboard();
  return leaderboard.slice(0, count).map(account => ({
    username: account.username,
    rating: account.rating.value,
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
 * Get the account position and rating.
 * @param username the username of the account.
 * @returns the account position and rating.
 */
export const getAccountStats = async (username: string) => {
  const position = await getAccountRanking(username);
  const rating = (await readAccountByUsername(username)).rating.value;
  return {
    position: position + 1, // Convert to 1-based index
    rating: rating,
  };
}

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
};
