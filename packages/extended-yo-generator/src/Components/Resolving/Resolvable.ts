import { ResolveFunction } from "./ResolveFunction.js";
import { ResolveValue } from "./ResolveValue.js";

/**
 * Represents a resolvable value.
 *
 * @template TTarget
 * The type of the resolve-target.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TType
 * The type of the value to resolve.
 */
export type Resolvable<TTarget, TSettings, TOptions, TType> = ResolveValue<TType> | ResolveFunction<TTarget, TSettings, TOptions, TType>;
