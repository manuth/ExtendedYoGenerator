import { Resolvable } from "./Resolvable";

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
export type ResolvableAsync<TTarget, TSettings, TOptions, TType> = Resolvable<TTarget, TSettings, TOptions, TType | Promise<TType>>;
