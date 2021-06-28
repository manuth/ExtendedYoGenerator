import { Constructor } from "./Constructor";
import { IObjectExtension } from "./IObjectExtension";

/**
 * Represents a constructor for an object-extension.
 */
export type ExtensionConstructor<T extends Constructor<any>, TInstance, TExtension extends IObjectExtension<TInstance>> =
    T extends new (...args: any[]) => infer UInstance ?
    UInstance extends TInstance ?
    (T & (new (...args: any[]) => (TExtension))) :
    never :
    never;
