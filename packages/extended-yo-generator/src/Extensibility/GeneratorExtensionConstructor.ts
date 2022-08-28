import { Generator } from "../Generator.js";
import { GeneratorConstructor } from "../GeneratorConstructor.js";
import { ExtensionConstructor } from "./ExtensionConstructor.js";
import { GeneratorExtension } from "./GeneratorExtension.js";

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
