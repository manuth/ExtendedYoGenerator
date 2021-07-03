import { Constructor } from "../Constructor";

/**
 * Represents an extension for a type.
 *
 * @template T
 * The type of the base.
 */
export abstract class ObjectExtension<T extends Constructor<any>>
{
    /**
     * Initializes a new instance of the {@link ObjectExtension `ObjectExtension<T>`} class.
     */
    protected constructor()
    {
        throw new Error();
    }

    /**
     * Gets the base of the extension.
     */
    protected get Base(): InstanceType<T>
    {
        return null;
    }

    /**
     * Initializes the object.
     *
     * @param args
     * The arguments for creating the base.
     */
    protected Initialize(...args: ConstructorParameters<T>): void
    { }

    /**
     * Initializes an instance of the base of the extension.
     *
     * @param args
     * The arguments for creating the base.
     *
     * @returns
     * The newly created base.
     */
    protected InitializeBase(...args: ConstructorParameters<T>): InstanceType<T>
    {
        return null;
    }
}
