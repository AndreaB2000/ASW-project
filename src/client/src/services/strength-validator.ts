/**
 * This file contains the logic for validating the strength of a password and a username.
 * It checks for various criteria such as length, character variety, and common patterns.
*/
import zxcvbn from "zxcvbn";

/**
 * Validates the strength of a username.
 * @param password - The password to validate.
 * @returns {boolean} - Returns true if the password is strong, false otherwise.
 */
export const isPasswordStrong = (password: string): boolean => {
  const basicFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // home-brew check
  return basicFormat.test(password) && zxcvbn(password).score >= 3;
};

/**
 * Validates the strength of a username.
 * @param username - The username to validate.
 * @returns {boolean} - Returns true if the username is strong, false otherwise.
 */
export const isUsernameStrong = (username: string): boolean => {
  const basicFormat = /^[a-zA-Z0-9._-]{3,}$/;
  return basicFormat.test(username);
}
