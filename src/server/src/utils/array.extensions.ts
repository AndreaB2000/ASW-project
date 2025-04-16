declare global {
  interface Array<T> {
    findAsync(
      predicate: (item: T, index: number, array: T[]) => Promise<boolean>,
    ): Promise<T | undefined>;
  }
}

/**
 * Asynchronously finds the first element in the array that satisfies the provided asynchronous predicate function.
 *
 * The function executes the predicate sequentially for each element in the array, awaiting the result each time.
 * Once a predicate returns `true`, the corresponding element is immediately returned.
 * If no element satisfies the predicate, `undefined` is returned.
 *
 * @template T - The type of elements in the array.
 * @param predicate - An asynchronous function that takes the current element, its index, and the array, and returns a Promise<boolean>.
 * @returns A Promise that resolves to the first element that satisfies the predicate, or `undefined` if none do.
 */
const findAsync = async function <T>(
  this: T[],
  predicate: (item: T, index: number, array: T[]) => Promise<boolean>,
): Promise<T | undefined> {
  for (let i = 0; i < this.length; i++) {
    if (await predicate(this[i], i, this)) {
      return this[i];
    }
  }
  return undefined;
};

if (!Array.prototype.findAsync) {
  Array.prototype.findAsync = findAsync;
}

export {};
