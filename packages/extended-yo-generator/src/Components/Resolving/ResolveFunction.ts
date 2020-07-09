import { IGenerator } from "../../IGenerator";

/**
 * Represents a resolveable value.
 */
export type ResolveFunction<TTarget, TSettings, TType> = (
    /**
     * Represents a function for resolving a value.
     *
     * @param target
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     */
    (target: TTarget, generator: IGenerator<TSettings>) => TType | Promise<TType>);
