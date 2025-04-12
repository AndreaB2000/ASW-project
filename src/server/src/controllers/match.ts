import { Request, Response } from 'express';
import * as service from '../services/match';
import * as moveFactory from '../models/Move';

/**
 * PUT /match/<id>/move
 * Adds a move to a certain match.
 */
export const addMove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movingPlayer, x, y } = req.body;
    if (!movingPlayer || !x || !y) {
      res.status(400).json({ message: 'A player and some coordinates are required' });
      return;
    }
    const result = await service.addMove(req.params.id, movingPlayer, moveFactory.create(x, y));
    if (!result) res.status(400).json({ message: "This player can't make a move" });
    else res.status(200).json({ message: 'Move added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
