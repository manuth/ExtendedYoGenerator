/**
 * Represents a constructor.
 *
 * @template T
 * The type of the item that can be instantiated.
 */
export type Constructor<T> = new (...params: any[]) => T;
