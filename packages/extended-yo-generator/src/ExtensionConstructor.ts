import { Constructor } from "./Constructor";
import { IObjectExtension } from "./IObjectExtension";

/**
 * Represents a constructor for an object-extension.
 *
 * @template TConstructor
 * The type of the constructor.
 *
 * @template TInstance
 * The type of the object that can be instantiated by {@link TConstructor `TConstructor`}.
 *
 * @template TExtension
 * The type of the object that can be instantiated by this constructor.
 */
export type ExtensionConstructor<TConstructor extends Constructor<any>, TInstance, TExtension extends IObjectExtension<TInstance>> =
    TConstructor extends new (...args: any[]) => infer UInstance ?
    UInstance extends TInstance ?
    (TConstructor & (new (...args: any[]) => (TExtension))) :
    never :
    never;
