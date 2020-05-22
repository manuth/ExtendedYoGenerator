import { IGeneratorSettings } from "../../IGeneratorSettings";
import { Generator } from "../../Generator";
import { IGenerator } from "../../IGenerator";

/**
 * Represents a resolveable value.
 */
export type ResolveFunction<TTarget, TSettings, TType> = ((target: TTarget, generator: IGenerator<TSettings>) => TType | Promise<TType>);
