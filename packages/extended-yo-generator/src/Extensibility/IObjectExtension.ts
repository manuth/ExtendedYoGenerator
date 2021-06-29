import { Constructor } from "../Constructor";

/**
 * Represents an extension for a type.
 *
 * @template TConstructor
 * The type of the base.
 */
export interface IObjectExtension<TConstructor extends Constructor<any>>
{
    /**
     * Gets the base of the extension.
     */
    Base: InstanceType<TConstructor>;
}
