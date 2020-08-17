import { ResolveFunction } from "./ResolveFunction";
import { ResolveValue } from "./ResolveValue";

/**
 * Represents a resolveable value.
 */
export type Resolvable<TTarget, TSettings, TOptions, TType> = ResolveValue<TType> | ResolveFunction<TTarget, TSettings, TOptions, TType>;
