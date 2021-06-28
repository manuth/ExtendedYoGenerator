/**
 * Represents an extension for a type.
 */
export interface IObjectExtension<T extends any>
{
    /**
     * Gets the base of the extension.
     */
    Base: T;
}
