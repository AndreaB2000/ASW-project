import { Request, Response } from 'express';
import { registerAccount } from '../services/account';
import * as factory from '../models/Account';

/**
 * POST /register
 * Register a new user
 *
 * @returns 201: registration completed, 409: account already exists, 400: missing fields, 500: internal server error
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      res.status(400).json({ message: 'Username, email and password are required' });
      return;
    }
    const user = await factory.createWithHashing(username, email, password);
    const result = await registerAccount(user);
    if (!result) res.status(409).json({ message: 'Account already exists' });
    else res.status(201).json({ message: 'Account registered successfully', username });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {};
