import { IGenerator } from "../../IGenerator.js";

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
export type ResolveFunction<TTarget, TSettings, TOptions, TType> = (
    /**
     * Represents a function for resolving a value.
     *
     * @param target
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     */
    (target: TTarget, generator: IGenerator<TSettings, TOptions>) => TType);
