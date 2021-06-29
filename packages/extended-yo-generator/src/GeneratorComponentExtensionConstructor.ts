import { GeneratorComponent } from "./Components/GeneratorComponent";
import { Constructor } from "./Constructor";
import { ExtensionConstructor } from "./ExtensionConstructor";
import { GeneratorComponentExtension } from "./GeneratorComponentExtension";
import { IObjectExtension } from "./IObjectExtension";

/**
 * Represents a constructor for a {@link GeneratorComponent `GeneratorComponent<TSettings, TOptions, TResolved>`}-extension.
 */
export type GeneratorComponentExtensionConstructor<T extends Constructor<GeneratorComponent<any, any, any>>> =
    T extends new (...args: any[]) => infer UComponent ?
    UComponent extends GeneratorComponent<any, any, any> ?
    ExtensionConstructor<T, IObjectExtension<T> & GeneratorComponentExtension<T>> :
    never :
    never;
