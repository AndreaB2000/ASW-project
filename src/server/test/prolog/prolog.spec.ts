import { jest, describe, it, expect, beforeEach, afterEach, beforeAll } from '@jest/globals';
import { query } from '../../src/prolog/prolog';
import { mockConsole } from '../test_utils/mock-console';
const pl = require('tau-prolog');
const fs = require('fs');

// Mock dependencies
jest.mock('tau-prolog', () => {
  const mockSession = {
    consult: jest.fn(),
    query: jest.fn(),
    answer: jest.fn(),
    format_answer: jest.fn(),
  };

  return {
    create: jest.fn(() => mockSession),
  };
});

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

jest.mock('path', () => ({
  resolve: jest.fn(() => '/mocked/path/to/bot.pl'),
}));

describe('Prolog Module', () => {
  const mockSession = pl.create();

  beforeAll(mockConsole);

  beforeEach(() => {
    jest.clearAllMocks();
    fs.readFileSync.mockReturnValue('mock prolog content');
  });

  describe('init function', () => {
    it('should initialize the Prolog engine successfully', async () => {
      // Setup mocks for successful initialization
      mockSession.consult.mockImplementation((_: any, callbacks: { success: () => void }) => {
        callbacks.success();
      });

      // Mock query to call success callback immediately
      mockSession.query.mockImplementation((_: any, callbacks: { success: () => void }) => {
        callbacks.success();
      });

      // Mock answer to immediately return false (no results)
      mockSession.answer.mockImplementation((callback: any) => {
        callback(false);
      });

      await query('test_goal');

      expect(fs.readFileSync).toHaveBeenCalledWith('/mocked/path/to/bot.pl', 'utf8');
      expect(mockSession.consult).toHaveBeenCalledWith('mock prolog content', expect.any(Object));
    });

    it('should handle file read errors', async () => {
      // Setup mock for file read error
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(query('test_goal')).rejects.toThrow('File not found');
    });

    it('should handle Prolog consultation errors', async () => {
      // Setup mock for Prolog consultation error
      mockSession.consult.mockImplementation(
        (_: any, callbacks: { error: (arg0: string) => void }) => {
          callbacks.error('Prolog syntax error');
        },
      );

      await expect(query('test_goal')).rejects.toBe('Prolog syntax error');
    });
  });

  describe('query function', () => {
    it('should return results from a successful query', async () => {
      // Setup mocks for successful query with results
      mockSession.consult.mockImplementation((_: any, callbacks: { success: () => void }) => {
        callbacks.success();
      });

      mockSession.query.mockImplementation((_: any, callbacks: { success: () => void }) => {
        callbacks.success();
      });

      const answers = [{ value: 'result1' }, { value: 'result2' }, null];
      let answerCallback: Function;

      mockSession.answer.mockImplementation((callback: Function) => {
        answerCallback = callback;
        setTimeout(() => {
          answers.forEach(answer => answerCallback(answer));
        }, 0);
      });

      mockSession.format_answer.mockImplementation(
        (answer: { value: any }) => `formatted_${answer.value}`,
      );

      const results = await query('test_goal');

      expect(mockSession.query).toHaveBeenCalledWith('test_goal', expect.any(Object));
      expect(results).toEqual(['formatted_result1', 'formatted_result2']);
    });

    it('should return empty array when no results found', async () => {
      // Setup mocks for successful query with no results
      mockSession.consult.mockImplementation((_: any, callbacks: { success: () => void }) => {
        callbacks.success();
      });

      mockSession.query.mockImplementation((_: any, callbacks: { success: () => void }) => {
        callbacks.success();
      });

      mockSession.answer.mockImplementation((callback: (arg0: boolean) => void) => {
        callback(false);
      });

      const results = await query('test_goal');

      expect(results).toEqual([]);
    });

    it('should handle query errors', async () => {
      // Setup mocks for query error
      mockSession.consult.mockImplementation((_: any, callbacks: { success: () => void }) => {
        callbacks.success();
      });

      mockSession.query.mockImplementation(
        (_: any, callbacks: { error: (arg0: string) => void }) => {
          callbacks.error('Query error');
        },
      );

      await expect(query('test_goal')).rejects.toBe('Query error');
    });
  });
});
