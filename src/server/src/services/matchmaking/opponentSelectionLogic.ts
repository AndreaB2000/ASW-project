import { readPlayerByUsername } from '../../repositories/player';

export const isValidMatch = async (candidate1: string, candidate2: string): Promise<boolean> => {
  // TODO : UNCOMMENT THIS CODE WHEN PLAYERS ARE SAVED IN DB

  // retrieve candidates' ratings
  // const player1 = await readPlayerByUsername(candidate1);
  // const player2 = await readPlayerByUsername(candidate2);

  // if (!player1 || !player2) {
  //   return false;
  // }

  // TODO : implement the logic to evaluate the match
  return true;
};
