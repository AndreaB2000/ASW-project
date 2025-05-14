import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { startRoutines, setRoutine } from '../../src/routines/routine';
import { createMatchIfPossible } from '../../src/routines/matchmaking';

jest.mock('../../src/routines/matchmaking', () => ({
  createMatchIfPossible: jest.fn(),
}));

describe('routines', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('setRoutine', () => {
    it('should call the task every interval', () => {
      const task = jest.fn( async (): Promise<void> => {
        // Simulate some asynchronous work
        return new Promise((resolve) => setTimeout(resolve, 100));
      });
      setRoutine(task, 5000);

      // Fast-forward time by 15 seconds
      jest.advanceTimersByTime(15000);

      expect(task).toHaveBeenCalledTimes(3);
    });
  });

  describe('startRoutines', () => {
    it('should set a routine with createMatchIfPossible every 5 seconds', () => {
      startRoutines();

      // Advance time by 10 seconds
      jest.advanceTimersByTime(10000);

      expect(createMatchIfPossible).toHaveBeenCalledTimes(2);
    });
  });
});