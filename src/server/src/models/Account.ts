/**
 * User representation with username and password used to access application.
 */
export interface Account {
  /**
   * Username of the user
   */
  get username(): string;
  /**
   * Password of the user
   */
  get password(): string;
}

/**
 * Account factory. Creates a new account with the given username and password.
 * @param username the username of the user
 * @param password the password of the user
 * @returns {Account} the account object
 */
export const createAccount = (username: string, password: string): Account =>
  new AccountImpl(username, password);

class AccountImpl implements Account {
  private name: string;
  private psw: string;

  get username(): string {
    return this.name;
  }
  get password(): string {
    return this.psw;
  }

  constructor(username: string, password: string) {
    this.name = username;
    this.psw = password;
  }
}
