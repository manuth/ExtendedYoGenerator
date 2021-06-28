import { ExtensionConstructor } from "./ExtensionConstructor";
import { Generator } from "./Generator";
import { GeneratorConstructor } from "./GeneratorConstructor";
import { IGeneratorExtension } from "./IBaseGenerator";

/**
 * Represents a constructor for a generator-extension.
 */
export type GeneratorExtensionConstructor<T extends GeneratorConstructor> =
    T extends new (...args: any[]) => infer UGenerator ?
    UGenerator extends Generator<any, any> ?
    ExtensionConstructor<T, Generator<any, any>, IGeneratorExtension<UGenerator>> :
    never :
    never;
