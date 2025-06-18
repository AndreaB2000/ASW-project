import { Socket } from 'socket.io/dist';
import { getPlayerRating } from '../services/rating';

export const rating = (socket: Socket) => {
  socket.on('getRating', async (username: string, callback: (rating: number) => void) => {
    const rating = await getPlayerRating(username);
    callback(rating);
  });
};
