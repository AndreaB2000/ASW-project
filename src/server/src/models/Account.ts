import bcrypt from 'bcrypt';
import { Rating, RatingFactory } from './Rating';

/**
 * Entity representing an account.
 */
export interface Account {
  /**
   * Username of the user
   */
  get username(): string;
  /**
   * Email of the user
   */
  get email(): string;
  /**
   * Hashed password of the account
   */
  get hashedPassword(): string;
  /**
   * Rating of the account
   */
  get rating(): Rating;
  /**
   * Checks if the given password matches the hashed password.
   * @param password the password to check
   */
  checkPassword(password: string): Promise<boolean>;
}

/**
 * Factory for creating accounts.
 */
export class AccountFactory {
  /**
   * Account factory. Creates a new account with the given username and password. The password will be hashed.
   * @param username the username of the user
   * @param email the email of the user
   * @param password the password of the user
   * @param rating the rating of the user
   * @returns {Account} the account object
   */
  public static createWithHashing = async (
    username: string,
    email: string,
    password: string,
    rating?: Rating,
  ): Promise<Account> => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return new AccountImpl(username, email, hashedPassword, rating);
  };

  /**
   * Account factory. Creates a new account with the given username and hashed password.
   * @param username the username of the user
   * @param email the email of the user
   * @param hashedPassword the hashed password of the user
   * @param rating the rating of the user
   * @returns {Account} the account object
   */
  public static create = (
    username: string,
    email: string,
    hashedPassword: string,
    rating?: Rating,
  ): Account => new AccountImpl(username, email, hashedPassword, rating);
}
class AccountImpl implements Account {
  private _username: string;
  private _email: string;
  private _hashedPassword: string;
  private _rating: Rating;

  get username(): string {
    return this._username;
  }
  get email(): string {
    return this._email;
  }
  get hashedPassword(): string {
    return this._hashedPassword;
  }

  get rating(): Rating {
    return this._rating;
  }

  constructor(username: string, email: string, password: string, rating?: Rating) {
    if (!this.isValidEmail(email)) throw new Error('Invalid email');
    if (!this.isValidUsername(username)) throw new Error('Invalid username');
    this._username = username;
    this._email = email;
    this._hashedPassword = password;
    this._rating = rating ?? RatingFactory.create();
  }

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this._hashedPassword);
  }

  private isValidEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.)+[^<>()\[\]\\.,;:\s@"]{2,})$/;
    return re.test(email);
  }

  private isValidUsername(username: string): boolean {
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
  }
}
