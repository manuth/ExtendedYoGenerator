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
        let result = value;

        if (result instanceof Function)
        {
            return result(target, generator);
        }
        else
        {
            return result;
        }
    }
}
