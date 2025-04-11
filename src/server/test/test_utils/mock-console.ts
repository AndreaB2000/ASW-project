/**
 * @file        mock-console.ts
 * @description Utility function to mock console.log, error and warn so that, in test environment,
 *            the output is not printed to the console.
 */
import { jest } from '@jest/globals';

/**
 * Mocks console.log, console.error and console.warn so that, in test environment,
 * the output is not printed to the console.
 *
 * Remember to call jest.resetAllMocks() in the afterEach of your test file to restore the original implementation.
 */
export function mockConsole(): void {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
}
