import { readPlayerByUsername } from '../../repositories/player';

export const evaluateOpponentMatch = async (
  candidate1: string,
  requestTime1: Date,
  candidate2: string,
  requestTime2: Date,
): Promise<boolean> => {
  // retrieve candidates' ratings
  const player1 = await readPlayerByUsername(candidate1);
  const player2 = await readPlayerByUsername(candidate2);

  if (!player1 || !player2) {
    return false;
  }

  // TODO : implement the logic to evaluate the match
  return true;
};
