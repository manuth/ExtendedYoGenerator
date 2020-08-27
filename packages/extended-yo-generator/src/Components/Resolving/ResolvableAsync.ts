import { Resolvable } from "./Resolvable";

/**
 * Represents a resolveable value.
 */
export type ResolvableAsync<TTarget, TSettings, TOptions, TType> = Resolvable<TTarget, TSettings, TOptions, TType | Promise<TType>>;
