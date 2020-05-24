import { Resolver } from "./Resolver";
import { IGenerator } from "../../IGenerator";
import { Resolvable } from "./Resolvable";

/**
 * Provides the functionality to resolve properties.
 */
export class PropertyResolver<TObject, TTarget, TSettings> extends Resolver<TTarget, TSettings>
{
    /**
     * The generator of the component.
     */
    private generator: IGenerator<TSettings>;

    /**
     * The actual object.
     */
    private object: TObject;

    /**
     * Initializes a new instance of the `PropertyResolver<TTarget, TSettings>` class.
     *
     * @param generator
     * The generator of the component.
     *
     * @param object
     * The options of the component.
     */
    public constructor(generator: IGenerator<TSettings>, object: TObject)
    {
        super();
        this.generator = generator;
        this.object = object;
    }

    /**
     * Gets the generator of the component.
     */
    protected get Generator(): IGenerator<TSettings>
    {
        return this.generator;
    }

    /**
     * Gets the actual object.
     */
    protected get Object(): TObject
    {
        return this.object;
    }

    /**
     * Resolves a value.
     *
     * @param target
     * The component.
     *
     * @param value
     * The value to resolve.
     */
    public async ResolveProperty<T>(target: TTarget, value: Resolvable<TTarget, TSettings, T>): Promise<T>
    {
        return this.Resolve(target, this.Generator, value);
    }
}