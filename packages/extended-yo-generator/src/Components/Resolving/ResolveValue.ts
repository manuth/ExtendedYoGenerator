/**
 * Represents a synchronous resolve-value.
 *
 * @template T
 * The type of the actual value.
 */
export type ResolveValue<T> = T extends (...args: any[]) => any ? never : T;
