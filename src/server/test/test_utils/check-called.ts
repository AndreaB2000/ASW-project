/**
 * @file        check-called.ts
 * @description Utility functions to check if a method was called with specific arguments
 *             in a jest test environment. Thought to be used for repository test files.
 */
import { jest, expect} from '@jest/globals';

/**
 * Tests if a spied function is called with the expected arguments inside a given method.
 * @param testedMethod method to be tested.
 * @param expectedWith arguments expected to be passed to the spied function.
 * @param spiedClass class containing the function to be spied.
 * @param spiedFunction the function to be spied.
 * @param mockedReturn mocked return value of the spied function.
 * @param args args to be passed to the tested method.
 */
export async function checkCalledWith<R>(
  testedMethod: (...args: any[]) => Promise<R>,
  expectedWith: Array<any>,
  spiedClass: any,
  spiedFunction: string,
  mockedReturn: any,
  args: any[],
): Promise<R> {
  const mockFun = jest.fn().mockReturnValue(mockedReturn);
  jest.spyOn(spiedClass, spiedFunction).mockImplementation(mockFun);

  const result = await testedMethod(...args);

  expect(mockFun).toHaveBeenCalledWith(...expectedWith);

  return result;
}

/**
 * Tests if a spied function is called inside a given method.
 * @param testedMethod method to be tested.
 * @param spiedClass class containing the function to be spied.
 * @param spiedFunction the function to be spied.
 * @param mockedReturn mocked return value of the spied function.
 * @param args args to be passed to the tested method.
 */
export async function checkCalled<R>(
  testedMethod: (...args: any[]) => Promise<R>,
  spiedClass: any,
  spiedFunction: string,
  mockedReturn: any,
  args: any[],
): Promise<R> {
  const mockFun = jest.fn().mockReturnValue(mockedReturn);
  jest.spyOn(spiedClass, spiedFunction).mockImplementation(mockFun);

  const result = await testedMethod(...args);

  expect(mockFun).toHaveBeenCalled();

  return result;
}
