import { ResolveValue } from "./ResolveValue.js";

/**
 * Represents a resolve-value.
 *
 * @template T
 * The type of the actual value.
 */
export type AsyncResolveValue<T> = ResolveValue<T | Promise<T>>;
