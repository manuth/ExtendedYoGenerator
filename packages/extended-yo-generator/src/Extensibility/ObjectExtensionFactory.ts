import { Constructor } from "../Constructor";
import { ExtensionConstructor } from "./ExtensionConstructor";
import { IObjectExtension } from "./IObjectExtension";

/**
 * Provides the functionality to create an object-extension.
 *
 * @template T
 * The type of the constructor of the base object.
 */
export class ObjectExtensionFactory<T extends Constructor<any>>
{
    /**
     * The default instance of the {@link ObjectExtensionFactory `ObjectExtensionFactory<T>`} class.
     */
    private static defaultExtensionFactory: ObjectExtensionFactory<any> = null;

    /**
     * Initializes a new instance of the {@link ObjectExtensionFactory `ObjectExtensionFactory`} class.
     */
    protected constructor()
    { }

    /**
     * Gets the default instance of the {@link ObjectExtensionFactory `ObjectExtensionFactory<T>`} class.
     */
    protected static get Default(): ObjectExtensionFactory<any>
    {
        if (this.defaultExtensionFactory === null)
        {
            this.defaultExtensionFactory = new ObjectExtensionFactory();
        }

        return this.defaultExtensionFactory;
    }

    /**
     * Creates an extension for the provided {@link baseConstructor `baseConstructor`}.
     *
     * @param baseConstructor
     * The constructor of the object-base.
     *
     * @returns
     * The extension-constructor for the specified {@link baseConstructor `baseConstructor`}.
     */
    public static Create<T extends Constructor<any>>(baseConstructor: T): ExtensionConstructor<T, IObjectExtension<InstanceType<T>>>
    {
        return this.Default.Create(baseConstructor);
    }

    /**
     * Creates an extension for the provided {@link baseConstructor `baseConstructor`}.
     *
     * @param baseConstructor
     * The constructor of the object-base.
     *
     * @returns
     * The extension-constructor for the specified {@link baseConstructor `baseConstructor`}.
     */
    public Create(baseConstructor: T): ExtensionConstructor<T, IObjectExtension<T>>
    {
        let self = this;

        return (
            (base: T): ExtensionConstructor<T, IObjectExtension<T>> =>
            {
                return class ObjectExtension extends base implements IObjectExtension<T>
                {
                    /**
                     * The base object of this extension.
                     */
                    private base: InstanceType<T>;

                    /**
                     * Initializes a new instance of the {@link ObjectExtension `ObjectExtension`} class.
                     *
                     * @param args
                     * The arguments for initializing the object.
                     */
                    public constructor(...args: any[])
                    {
                        super(...args);

                        self.Initialize(
                            base,
                            this as InstanceType<ExtensionConstructor<T, IObjectExtension<T>>>,
                            ...args);

                        this.base = self.InitializeBase(
                            base,
                            this as InstanceType<ExtensionConstructor<T, IObjectExtension<T>>>,
                            ...args);
                    }

                    /**
                     * Gets the base object of this extension.
                     */
                    public get Base(): InstanceType<T>
                    {
                        return this.base;
                    }
                } as ExtensionConstructor<T, IObjectExtension<T>>;
            })(baseConstructor);
    }

    /**
     * Initializes the extension.
     *
     * @param base
     * The constructor of the base type.
     *
     * @param instance
     * The instance of the extension type.
     *
     * @param args
     * The arguments for initializing the base.
     *
     * @returns
     * The newly created base object.
     */
    protected Initialize(base: T, instance: InstanceType<ExtensionConstructor<T, IObjectExtension<T>>>, ...args: any[]): void
    { }

    /**
     * Initializes a base object for the extension.
     *
     * @param base
     * The constructor of the base type.
     *
     * @param instance
     * The instance of the extension type.
     *
     * @param args
     * The arguments for initializing the base.
     *
     * @returns
     * The newly created base object.
     */
    protected InitializeBase(base: T, instance: InstanceType<ExtensionConstructor<T, IObjectExtension<T>>>, ...args: any[]): InstanceType<T>
    {
        return new base(...args);
    }

    /**
     * Gets all properties of the specified generator-class.
     *
     * @template T
     * The type of the generator to get the properties for.
     *
     * @param ctor
     * The constructor whose properties to get.
     *
     * @returns
     * The properties of the specified class.
     */
    protected GetAllProperties<T extends Constructor<any>>(ctor: T): { [P in keyof T]: TypedPropertyDescriptor<T[P]> } & { [x: string]: PropertyDescriptor }
    {
        let result: { [P in keyof T]: TypedPropertyDescriptor<T[P]> } & { [x: string]: PropertyDescriptor } = {} as any;

        for (let current = ctor.prototype; current !== Object.prototype; current = Object.getPrototypeOf(current))
        {
            result = {
                ...Object.getOwnPropertyDescriptors(current),
                ...result
            };
        }

        return result;
    }
}
