import { IGenerator } from "../../IGenerator.js";
import { Resolvable } from "./Resolvable.js";
import { Resolver } from "./Resolver.js";

/**
 * Provides the functionality to resolve properties.
 *
 * @template TObject
 * The type of the actual object.
 *
 * @template TTarget
 * The type of the resolve-target.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class PropertyResolver<TObject, TTarget, TSettings, TOptions> extends Resolver<TTarget, TSettings, TOptions>
{
    /**
     * The generator of the component.
     */
    private generator: IGenerator<TSettings, TOptions>;

    /**
     * The actual object.
     */
    private object: TObject;

    /**
     * Initializes a new instance of the {@link PropertyResolver `PropertyResolver<TObject, TTarget, TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the component.
     *
     * @param object
     * The options of the component.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, object: TObject)
    {
        super();
        this.generator = generator;
        this.object = object;
    }

    /**
     * Gets the generator of the component.
     */
    public get Generator(): IGenerator<TSettings, TOptions>
    {
        return this.generator;
    }

    /**
     * Gets or sets the actual object.
     */
    public get Object(): TObject
    {
        return this.object;
    }

    /**
     * @inheritdoc
     */
    public set Object(value: TObject)
    {
        this.object = value;
    }

    /**
     * Gets the resolved representation of the object.
     */
    public abstract get Result(): TObject;

    /**
     * Resolves a value.
     *
     * @template T
     * The type of the value to resolve.
     *
     * @param target
     * The component.
     *
     * @param value
     * The value to resolve.
     *
     * @returns
     * The resolved value.
     */
    protected ResolveProperty<T>(target: TTarget, value: Resolvable<TTarget, TSettings, TOptions, T>): T
    {
        if (typeof value === "function")
        {
            value = value.bind(this.Object);
        }

        return this.Resolve<T>(target, this.Generator, value);
    }
}
