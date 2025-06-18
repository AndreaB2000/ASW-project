/**
 * Round a number to a specified number of decimal places.
 * @param num - The number to round.
 * @param decimals - The number of decimal places to round to.
 * @returns The rounded number.
 * @example
 * roundToDecimal(3.14159, 2); // returns 3.14
 * roundToDecimal(2.71828, 3); // returns 2.718
 * roundToDecimal(1.61803, 4); // returns 1.618
 * roundToDecimal(1.41421, 5); // returns 1.41421
 * roundToDecimal(0.123456, 6); // returns 0.123456
 * roundToDecimal(0.987654, 7); // returns 0.987654
 * roundToDecimal(0.000001, 8); // returns 0.000001
 * roundToDecimal(0.999999, 9); // returns 0.999999
 */
export function roundToDecimal(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}