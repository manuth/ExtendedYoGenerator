import { ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { PropertyResolver } from "../../../Components/Resolving/PropertyResolver";
import { IGenerator } from "../../../IGenerator";
import { IGeneratorSettings } from "../../../IGeneratorSettings";
import { IResolverTestOptions } from "./IResolverTestOptions";

/**
 * A resolver-object for testing.
 */
export class ResolverTest extends PropertyResolver<IResolverTestOptions, ResolverTest, IGeneratorSettings, ITestGeneratorOptions<ITestOptions>> implements IResolverTestOptions
{
    /**
     * Initializes a new instance of the {@link ResolverTest `ResolverTest`} class.
     *
     * @param generator
     * The generator for the test-object.
     *
     * @param options
     * The options of the test-object.
     */
    public constructor(generator: IGenerator<IGeneratorSettings, ITestGeneratorOptions<ITestOptions>>, options: IResolverTestOptions)
    {
        super(generator, options);
    }

    /**
     * Gets a test-value.
     */
    public get TestValue(): Promise<string>
    {
        return this.ResolveProperty(this, this.Object.TestValue) as Promise<string>;
    }

    /**
     * Gets a test-promise.
     */
    public get TestPromise(): Promise<Promise<string>>
    {
        return this.ResolveProperty(this, this.Object.TestPromise) as Promise<Promise<string>>;
    }

    /**
     * Gets a test-function
     */
    public get TestFunction(): Promise<() => string>
    {
        return this.ResolveProperty(this, this.Object.TestFunction) as Promise<() => string>;
    }

    /**
     * @inheritdoc
     */
    public get Result(): IResolverTestOptions
    {
        return this;
    }
}
