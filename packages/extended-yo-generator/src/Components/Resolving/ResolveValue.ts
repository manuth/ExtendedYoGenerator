/**
 * Represents a synchronous resolve-value.
 */
export type ResolveValue<T> = T extends (...args: any[]) => any ? never : T;
