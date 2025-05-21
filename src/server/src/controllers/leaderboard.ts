import { getTop5 } from "../services/leaderboard";
import { Player } from "../models/Player";

export const getTopPlayers = async (): Promise<Player[]> => {
  return await getTop5();
}