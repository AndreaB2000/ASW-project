import { readPlayerByUsername } from '../../repositories/player';

export const isValidMatch = async (candidate1: string, candidate2: string, maxDiff: number): Promise<boolean> => {
  // retrieve candidates' ratings
  const player1 = await readPlayerByUsername(candidate1);
  const player2 = await readPlayerByUsername(candidate2);

  if (!player1 || !player2) {
    return false;
  }

  return Math.abs(Number(player1.rating) - Number(player2.rating)) <= maxDiff;
};
