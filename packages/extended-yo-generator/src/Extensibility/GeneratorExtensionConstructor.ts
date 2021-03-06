import { Generator } from "../Generator";
import { GeneratorConstructor } from "../GeneratorConstructor";
import { ExtensionConstructor } from "./ExtensionConstructor";
import { GeneratorExtension } from "./GeneratorExtension";

/**
 * Represents a constructor for a generator-extension.
 *
 * @template T
 * The type of the generator-constructor.
 */
export type GeneratorExtensionConstructor<T extends GeneratorConstructor> =
    T extends new (...args: any[]) => infer UGenerator ?
    UGenerator extends Generator<any, any> ?
    ExtensionConstructor<T, GeneratorExtension<T>> :
    never :
    never;
