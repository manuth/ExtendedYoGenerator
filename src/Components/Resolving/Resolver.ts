import { IGenerator } from "../../IGenerator";
import { Resolvable } from "./Resolvable";

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
     *
     * @returns
     * The resolved value.
     */
    protected async Resolve<T>(target: TTarget, generator: IGenerator<TSettings>, value: Resolvable<TTarget, TSettings, T>): Promise<T>
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
