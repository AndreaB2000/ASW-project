import { registerAccount } from '../services/account';
import { Account } from '../models/Account';

/**
 * Register a new account
 */
export const register = async (account: Account): Promise<RegisterResult> => {
  try {
    if (!account.username || !account.hashedPassword) {
      return new RegisterResult(false, 'Username and password are required', account.username);
    }
    const result = await registerAccount(account);
    if (!result) return new RegisterResult(false, 'Account already exists', account.username);
    else return new RegisterResult(true, 'Account created successfully', account.username);
  } catch (error) {
    console.error('Error registering account:', error);
    return new RegisterResult(false, 'Internal server error', account.username);
  }
};

export class RegisterResult {
  success: boolean;
  message: string;
  username: string;
  constructor(success: boolean, message: string, username: string) {
    this.success = success;
    this.message = message;
    this.username = username;
  }
}
