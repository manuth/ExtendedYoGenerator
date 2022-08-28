import { IGenerator } from "../../IGenerator.js";
import { Resolvable } from "./Resolvable.js";

/**
 * Provides the functionality to resolve values.
 *
 * @template TTarget
 * The target of the resolve.
 *
 * @template TSettings
 * The type of the settings of the target's generator.
 *
 * @template TOptions
 * The type of the options of the target's generator.
 */
export class Resolver<TTarget, TSettings, TOptions>
{
    /**
     * Resolves a value.
     *
     * @template T
     * The type of the value to resolve.
     *
     * @param target
     * The component.
     *
     * @param generator
     * The generator of the component.
     *
     * @param value
     * The value to resolve.
     *
     * @returns
     * The resolved value.
     */
    protected Resolve<T>(target: TTarget, generator: IGenerator<TSettings, TOptions>, value: Resolvable<TTarget, TSettings, TOptions, T>): T
    {
        if (value instanceof Function)
        {
            return value(target, generator);
        }
        else
        {
            let result: T = value;
            return result;
        }
    }
}
