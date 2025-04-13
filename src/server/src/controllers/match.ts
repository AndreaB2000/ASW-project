import { Request, Response } from 'express';
import * as service from '../services/match';
import * as moveFactory from '../models/Move';

/**
 * PUT /match/:id/move
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

/**
 * GET /match/:id
 * Returns the match corresponding to the given ID.
 */
export const getMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const match = await service.getMatch(req.params.id);
    if (match == null) res.status(404).json({ message: 'This match does not exist' });
    else res.status(200).json({ id: req.params.id, ...match });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * GET /match/byplayer/:player
 * Returns a list of matches played by the specified player.
 */
export const getMatchesByPlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const matchIDs = await service.getMatchesByPlayer(req.params.player);
    res.status(200).json({ player: req.params.player, matchIDs: matchIDs });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * DELETE /match/:id/delete
 * Deletes the match corresponding to the given ID.
 */
export const deleteMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await service.deleteMatch(req.params.id);
    if (!deleted) res.status(404).json({ message: 'This match does not exist' });
    else res.status(200).json({ message: 'The match has been successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
