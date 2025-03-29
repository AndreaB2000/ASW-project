import { Request, Response } from 'express';
import { registerAccount } from '../services/account';
import { validationResult } from 'express-validator/lib';

/**
 * POST /register
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }
    const errors = validationResult(req); // this should be added as middleware
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const result = await registerAccount(username, password);
    if (!result) {
      res.status(409).json({ message: 'Account already exists' });
      return;
    }
    res.status(201).json({ message: 'Account registered successfully', username });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
