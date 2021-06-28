import { CompositeConstructor } from "./CompositeConstructor";
import { Generator } from "./Generator";
import { GeneratorConstructor } from "./GeneratorConstructor";
import { IGeneratorExtension } from "./IBaseGenerator";

/**
 * Represents a constructor for a generator-base.
 */
export type CompositeGeneratorConstructor<T extends GeneratorConstructor> =
    T extends new (...args: any[]) => infer UGenerator ?
    UGenerator extends Generator<any, any> ?
    CompositeConstructor<T, Generator<any, any>, IGeneratorExtension<UGenerator>> :
    never :
    never;
