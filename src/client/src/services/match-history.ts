import { socket } from '@/services/server-connections';
import { formatDateTime } from './datetime-formatter';

export type Match = {
  opponent: string;
  winner: string | null;
  creationDate: string;
  ratingDelta: number;
};

export const getMatchHistory = async (username: string): Promise<Match[]> => {
  return new Promise(resolve => {
    let matches: Match[] = [];

    socket.emit('matchHistory', username, async (matchIds: string[]) => {
      const matchPromises: Promise<void>[] = matchIds.map((id: string) => {
        return new Promise<void>(resolveMatch => {
          socket.emit('getMatch', id, (error: any, matchData: any, whichPlayerAmI: number) => {
            if (error) {
              console.error('Error getting match', error);
              resolveMatch();
              return;
            }
            matches.push({
              opponent: username === matchData.player1 ? matchData.player2 : matchData.player1,
              winner: matchData.winner,
              creationDate: formatDateTime(new Date(matchData.creationDate)),
              ratingDelta: matchData.ratingDelta,
            });
            resolveMatch();
          });
        });
      });

      await Promise.all(matchPromises);
      matches = matches.sort((a, b) => {
        return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      });
      resolve(matches);
    });
  });
};
