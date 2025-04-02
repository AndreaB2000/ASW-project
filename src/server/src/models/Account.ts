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
   * Hashed password of the account
   */
  get hashedPassword(): string;
  /**
   * Checks if the given password matches the hashed password.
   * @param password the password to check
   */
  checkPassword(password: string): Promise<boolean>;
}

/**
 * Account factory. Creates a new account with the given username and password. The password will be hashed.
 * @param username the username of the user
 * @param password the password of the user
 * @returns {Account} the account object
 */
export const createWithHashing = async (username: string, password: string): Promise<Account> => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return new AccountImpl(username, hashedPassword);
};

/**
 * Account factory. Creates a new account with the given username and hashed password.
 * @param username the username of the user
 * @param hashedPassword the hashed password of the user
 * @returns {Account} the account object
 */
export const create = async (username: string, hashedPassword: string): Promise<Account> =>
  new AccountImpl(username, hashedPassword);

class AccountImpl implements Account {
  private name: string;
  private psw: string;

  get username(): string {
    return this.name;
  }
  get hashedPassword(): string {
    return this.psw;
  }

  constructor(username: string, password: string) {
    this.name = username;
    this.psw = password;
  }

  checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.psw);
  }
}
