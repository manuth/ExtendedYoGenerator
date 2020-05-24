/**
 * Represents a resolve-value.
 */
export type ResolveValue<T> = T extends Function ? Promise<T> : T | Promise<T>;
