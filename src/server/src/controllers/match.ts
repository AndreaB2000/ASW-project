import { Request, Response } from 'express';

/**
 * PUT /match/<id>/move
 */
export const addMove = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  res.status(200);
  res.json(service.getMatch(id));
};
