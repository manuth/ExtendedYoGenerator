import { ResolveValue } from "./ResolveValue";

/**
 * Represents a resolve-value.
 */
export type AsyncResolveValue<T> = ResolveValue<T | Promise<T>>;
