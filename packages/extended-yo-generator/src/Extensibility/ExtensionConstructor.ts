import { Constructor } from "../Constructor";
import { ObjectExtension } from "./ObjectExtension";

/**
 * Represents a constructor for an object-extension.
 *
 * @template TConstructor
 * The type of the constructor.
 *
 * @template TExtension
 * The type of the object that can be instantiated by this constructor.
 */
export type ExtensionConstructor<TConstructor extends Constructor<any>, TExtension extends ObjectExtension<TConstructor>> =
    TConstructor extends new (...args: any[]) => any ?
    TConstructor & (new (...args: any[]) => TExtension) :
    never;
