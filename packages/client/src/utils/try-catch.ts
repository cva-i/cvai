/**
 * Utility function to handle async operations with a tuple return pattern
 * instead of try-catch blocks.
 *
 * @example
 * const [data, error] = await tryCatch(fetchData());
 * if (error) {
 *   console.error(error);
 *   return;
 * }
 * // Use data safely
 */
export async function tryCatch<T, E = Error>(promise: T | Promise<T>) {
  try {
    const data = await promise;
    return [data, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}

/**
 * Synchronous version of tryCatch for handling synchronous operations
 * with a tuple return pattern instead of try-catch blocks.
 *
 * @example
 * const [data, error] = tryCatchSync(() => JSON.parse(jsonString));
 * if (error) {
 *   console.error(error);
 *   return;
 * }
 * // Use data safely
 */
export function tryCatchSync<T, E = Error>(fn: () => T) {
  try {
    const data = fn();
    return [data, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
