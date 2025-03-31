import { Request, Response } from 'express';
import { registerAccount } from '../services/account';

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
