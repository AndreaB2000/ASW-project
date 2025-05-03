import { Request, Response } from 'express';
import { registerAccount, authenticateAccount } from '../services/account';
import * as factory from '../models/Account';
import jwt from 'jsonwebtoken';
import { secret, expiration } from '../config/jwt';

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

/**
 * POST /login
 * Authenticate a user
 *
 * @returns 201: with the created jwt in the cookie, 400: missing fields, 409: invalid credentials, 500: internal server error
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    const user = await authenticateAccount(email, password);
    if (!user) {
      res.status(409).json({ message: 'Invalid email or password' });
      return;
    }
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
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
      .status(201);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
