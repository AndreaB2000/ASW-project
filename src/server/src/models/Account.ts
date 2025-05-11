import bcrypt from 'bcrypt';

/**
 * Value object representing an account.
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
   * Checks if the given password matches the hashed password.
   * @param password the password to check
   */
  checkPassword(password: string): Promise<boolean>;
}

export class AccountFactory {
  /**
   * Creates a new account with the given username and password. The password will be hashed.
   * @param username the username of the user
   * @param email the email of the user
   * @param password the password of the user
   * @returns {Account} the account object
   */
  static async createWithHashing(
    username: string,
    email: string,
    password: string,
  ): Promise<Account> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return new AccountImpl(username, email, hashedPassword);
  }

  /**
   * Creates a new account with the given username and hashed password.
   * @param username the username of the user
   * @param email the email of the user
   * @param hashedPassword the hashed password of the user
   * @returns {Account} the account object
   */
  static create(username: string, email: string, hashedPassword: string): Account {
    return new AccountImpl(username, email, hashedPassword);
  }
}

class AccountImpl implements Account {
  private name: string;
  private mail: string;
  private psw: string;

  get username(): string {
    return this.name;
  }
  get email(): string {
    return this.mail;
  }
  get hashedPassword(): string {
    return this.psw;
  }

  constructor(username: string, email: string, password: string) {
    this.name = username;
    this.mail = email;
    this.psw = password;
  }

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.psw);
  }
}
