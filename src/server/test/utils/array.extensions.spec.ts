import '../../src/utils/array.extensions';
import { describe, it, expect } from '@jest/globals';

describe('Array.prototype.findAsync', () => {
  it('should return the first matching element', async () => {
    const arr = [1, 2, 3, 4, 5];

    const result = await arr.findAsync(async (num) => {
      return num % 2 === 0;
    });

    expect(result).toBe(2);
  });

  it('should return undefined if no element matches', async () => {
    const arr = [1, 3, 5];

    const result = await arr.findAsync(async (num) => {
      return num % 2 === 0;
    });

    expect(result).toBeUndefined();
  });

  it('should support async delays', async () => {
    const arr = [10, 20, 30];

    const result = await arr.findAsync(async (num) => {
      await new Promise((res) => setTimeout(res, 10)); // Simulate delay
      return num === 20;
    });

    expect(result).toBe(20);
  });

  it('should provide index and array to the predicate', async () => {
    const arr = [5, 10, 15];

    const indices: number[] = [];
    const result = await arr.findAsync(async (num, index, arrayRef) => {
      indices.push(index);
      expect(arrayRef).toBe(arr);
      return false;
    });

    expect(result).toBeUndefined();
    expect(indices).toEqual([0, 1, 2]);
  });
});
