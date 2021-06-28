/**
 * Represents an extension for a type.
 *
 * @template T
 * The type of the base.
 */
export interface IObjectExtension<T extends any>
{
    /**
     * Gets the base of the extension.
     */
    Base: T;
}
