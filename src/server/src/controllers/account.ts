import { Request, Response } from 'express';
import { registerAccount, authenticateAccount } from '../services/account';
import { AccountFactory } from '../models/Account';
import { secret } from '../config/jwt';
import { expiration } from '../config/jwt';
import jwt from 'jsonwebtoken';

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
    const user = await AccountFactory.createWithHashing(username, email, password);
    const result = await registerAccount(user);
    if (!result) res.status(409).json({ message: 'Account already exists' });
    else res.status(201).json({ message: 'Account registered successfully', username });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * POST /login
 * Authenticate an existing account
 *
 * @returns 200: with the created jwt in the cookie, 400: missing fields, 409: invalid credentials, 500: internal server error
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }
    const account = await authenticateAccount(username, password);
    if (!account) {
      res.status(409).json({ message: 'Invalid username or password' });
      return;
    }
    const token = jwt.sign(
      {
        username: account.username,
        email: account.email,
      },
      secret,
      { expiresIn: expiration },
    );
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: expiration * 1000,
      })
      .status(200)
      .json({ message: 'Login successful' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
