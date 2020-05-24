import { Resolvable } from "./Resolvable";
import { IGeneratorSettings } from "../../IGeneratorSettings";
import { Generator } from "../../Generator";
import { IGenerator } from "../../IGenerator";

/**
 * Provides the functionality to resolve values.
 */
export class Resolver<TTarget, TSettings>
{
    /**
     * Resolves a value.
     *
     * @param target
     * The component.
     *
     * @param generator
     * The generator of the component.
     *
     * @param value
     * The value to resolve.
     */
    public async Resolve<T>(target: TTarget, generator: IGenerator<TSettings>, value: Resolvable<TTarget, TSettings, T>): Promise<T>
    {
        if (value instanceof Function)
        {
            return value(target, generator);
        }
        else
        {
            let result: Promise<T> | T = value;
            return result;
        }
    }
}
