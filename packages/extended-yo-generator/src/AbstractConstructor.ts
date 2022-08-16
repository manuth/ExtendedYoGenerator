/**
 * Represents an abstract constructor.
 *
 * @template T
 * The type of the item that can be instantiated.
 */
export type AbstractConstructor<T> = abstract new (...params: any[]) => T;
