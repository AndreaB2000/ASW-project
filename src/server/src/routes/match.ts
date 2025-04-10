import { Router } from 'express';
import * as controller from '../controllers/match';

export const match = Router();

match.put('/:id/move', controller.addMove);
