import { Router } from 'express';
import * as controller from '../controllers/match';

export const match = Router();

match.get('/:id', controller.getMatch);
match.get('/byplayer/:player', controller.getMatchesByPlayer);
match.put('/:id/move', controller.addMove);
match.delete('/:id/delete', controller.deleteMatch);
