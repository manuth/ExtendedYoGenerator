import { IGenerator } from "../../IGenerator";

/**
 * Represents a resolveable value.
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
    (target: TTarget, generator: IGenerator<TSettings, TOptions>) => TType | Promise<TType>);
