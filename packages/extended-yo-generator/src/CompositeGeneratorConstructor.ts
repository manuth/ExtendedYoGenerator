import { Generator } from "./Generator";
import { GeneratorConstructor } from "./GeneratorConstructor";
import { IBaseGenerator } from "./IBaseGenerator";

/**
 * Represents a constructor for a generator-base.
 */
export type CompositeGeneratorConstructor<T extends GeneratorConstructor> =
    T extends new (...args: any[]) => infer UGenerator ?
    UGenerator extends Generator<any, any> ?
    (T & (new (...args: any[]) => (IBaseGenerator<UGenerator>))) :
    never :
    never;