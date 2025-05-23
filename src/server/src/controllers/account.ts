import { Request, Response } from 'express';
import * as service from '../services/account';
import { Account, AccountFactory } from '../models/Account';
import { secret } from '../config/jwt';
import { expiration } from '../config/jwt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from 'authenticated-request';

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
    const result = await service.registerAccount(user);
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
    const account = await service.authenticateAccount(username, password);
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

/**
 * POST /logout
 * Logout the user
 *
 * @returns 200: logout successful, 500: internal server error
 */
export const logout = async (_: AuthenticatedRequest, res: Response): Promise<void> => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    .status(200)
    .json({ message: 'Logout successful' });
};

/**
 * GET /me
 * Get the current user's account information
 *
 * @returns 200: with the user data
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { username, email } = req.account;
  res.status(200).json({ username, email });
}

/*********************************** SOCKET ********************************/

/**
 * Change the email of the user
 * @param newEmail the new email of the user
 */
export const changeEmail = async (oldAccount: Account, newEmail: string): Promise<void> => {
  if (!await service.updateEmail(oldAccount, newEmail)) {
    throw new Error('Email already exists');
  }
};
