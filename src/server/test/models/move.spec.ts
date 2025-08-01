import { MoveFactory } from '../../src/models/Move';
import { describe, it, expect } from '@jest/globals';

describe('Move', () => {
  it('should have the correct coordinates inside, given at creation time', () => {
    const X: number = 3;
    const Y: number = 4;

    const move = MoveFactory.create(X, Y);
    expect(move.x).toBe(X);
    expect(move.y).toBe(Y);
  });
});
