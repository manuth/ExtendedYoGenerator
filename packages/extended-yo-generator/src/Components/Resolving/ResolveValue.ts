/**
 * Represents a resolve-value.
 */
export type ResolveValue<T> = T extends (...args: any[]) => any ? Promise<T> : T | Promise<T>;
