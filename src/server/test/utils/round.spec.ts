import { describe, expect, it } from '@jest/globals';
import { roundToDecimal } from '../../src/utils/round';

describe('roundToDecimal', () => {
  it('should round to 0 decimal places (whole numbers)', () => {
    expect(roundToDecimal(3.14159, 0)).toBe(3);
    expect(roundToDecimal(2.71828, 0)).toBe(3);
    expect(roundToDecimal(1.49999, 0)).toBe(1);
    expect(roundToDecimal(1.5, 0)).toBe(2);
  });

  it('should round to 1 decimal place', () => {
    expect(roundToDecimal(3.14159, 1)).toBe(3.1);
    expect(roundToDecimal(2.71828, 1)).toBe(2.7);
    expect(roundToDecimal(1.95, 1)).toBe(2.0);
    expect(roundToDecimal(1.05, 1)).toBe(1.1);
  });

  it('should round to 2 decimal places', () => {
    expect(roundToDecimal(3.14159, 2)).toBe(3.14);
    expect(roundToDecimal(2.71828, 2)).toBe(2.72);
    expect(roundToDecimal(0.125, 2)).toBe(0.13);
    expect(roundToDecimal(0.1249, 2)).toBe(0.12);
  });

  it('should handle rounding at exactly the midpoint', () => {
    expect(roundToDecimal(2.5, 0)).toBe(3);
    expect(roundToDecimal(3.5, 0)).toBe(4);
    expect(roundToDecimal(1.25, 1)).toBe(1.3);
    expect(roundToDecimal(1.35, 1)).toBe(1.4);
  });

  it('should handle negative numbers correctly', () => {
    expect(roundToDecimal(-3.14159, 2)).toBe(-3.14);
    expect(roundToDecimal(-2.71828, 1)).toBe(-2.7);
    expect(roundToDecimal(-1.5, 0)).toBe(-1);
  });

  it('should handle zero correctly', () => {
    expect(roundToDecimal(0, 2)).toBe(0);
    expect(roundToDecimal(0, 0)).toBe(0);
    expect(roundToDecimal(0.00001, 4)).toBe(0);
  });

  it('should maintain precision for numbers already at the correct precision', () => {
    expect(roundToDecimal(3.14, 2)).toBe(3.14);
    expect(roundToDecimal(42, 0)).toBe(42);
    expect(roundToDecimal(1.0, 1)).toBe(1.0);
  });

  it('should handle higher precision rounding', () => {
    expect(roundToDecimal(Math.PI, 5)).toBe(3.14159);
    expect(roundToDecimal(1.618033988749895, 6)).toBe(1.618034);
  });

  it('should match the examples in the documentation', () => {
    expect(roundToDecimal(3.14159, 2)).toBe(3.14);
    expect(roundToDecimal(2.71828, 3)).toBe(2.718);
    expect(roundToDecimal(1.61803, 4)).toBe(1.618);
    expect(roundToDecimal(1.41421, 5)).toBe(1.41421);
    expect(roundToDecimal(0.123456, 6)).toBe(0.123456);
    expect(roundToDecimal(0.987654, 7)).toBe(0.987654);
    expect(roundToDecimal(0.000001, 8)).toBe(0.000001);
    expect(roundToDecimal(0.999999, 9)).toBe(0.999999);
  });
});
