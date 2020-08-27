import { ResolveFunction } from "./ResolveFunction";

/**
 * Represents a resolveable value.
 */
export type AsyncResolveFunction<TTarget, TSettings, TOptions, TType> = ResolveFunction<TTarget, TSettings, TOptions, TType | Promise<TType>>;
