import { PropertyResolver } from "../../../Components/Resolving/PropertyResolver";
import { IResolverTestOptions } from "./IResolverTestOptions";
import { IGenerator } from "../../../IGenerator";

/**
 * A resolver-object for testing.
 */
export class ResolverTest extends PropertyResolver<IResolverTestOptions, ResolverTest, any>
{
    /**
     * Initializes a new instance of the `ResolverTest` class.
     *
     * @param generator
     * The generator for the test-object.
     *
     * @param options
     * The options of the test-object.
     */
    public constructor(generator: IGenerator<any>, options: IResolverTestOptions)
    {
        super(generator, options);
    }

    /**
     * Gets a test-value.
     */
    public get TestValue(): Promise<string>
    {
        return this.ResolveProperty(this, this.Object.TestValue);
    }

    /**
     * Gets a test-promise.
     */
    public get TestPromise(): Promise<Promise<string>>
    {
        return this.ResolveProperty(this, this.Object.TestPromise);
    }

    public get TestFunction(): Promise<() => string>
    {
        return this.ResolveProperty(this, this.Object.TestFunction);
    }
}
