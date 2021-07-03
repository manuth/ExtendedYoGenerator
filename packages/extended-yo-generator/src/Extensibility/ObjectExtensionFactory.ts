import { Constructor } from "../Constructor";
import { ExtensionConstructor } from "./ExtensionConstructor";
import { ObjectExtension as ObjectExtensionBase } from "./ObjectExtension";

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
    public static Create<T extends Constructor<any>>(baseConstructor: T): ExtensionConstructor<T, ObjectExtensionBase<InstanceType<T>>>
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
    public Create(baseConstructor: T): ExtensionConstructor<T, ObjectExtensionBase<T>>
    {
        return (
            (base: Constructor<ObjectExtensionBase<T>>): ExtensionConstructor<T, ObjectExtensionBase<T>> =>
            {
                return class ObjectExtension extends base
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
                    public constructor(...args: ConstructorParameters<T>)
                    {
                        super(...args);
                        this.Initialize(...args);
                        this.base = this.InitializeBase(...args);
                    }

                    /**
                     * @inheritdoc
                     */
                    protected override get Base(): InstanceType<T>
                    {
                        return this.base;
                    }

                    /**
                     * @inheritdoc
                     *
                     * @param args
                     * The arguments for creating the base.
                     */
                    protected override Initialize(...args: ConstructorParameters<T>): void
                    { }

                    /**
                     * @inheritdoc
                     *
                     * @param args
                     * The arguments for creating the base.
                     *
                     * @returns
                     * The newly created base.
                     */
                    protected override InitializeBase(...args: ConstructorParameters<T>): InstanceType<T>
                    {
                        return new baseConstructor(...args);
                    }
                } as ExtensionConstructor<T, ObjectExtensionBase<T>>;
            })(baseConstructor);
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
