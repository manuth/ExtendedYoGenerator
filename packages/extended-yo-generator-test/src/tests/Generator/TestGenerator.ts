import { Generator, IGeneratorSettings } from "@manuth/extended-yo-generator";

/**
 * Provides an implementation of the `Generator` class for testing.
 */
export class TestGenerator<T> extends Generator<IGeneratorSettings & Record<string, any>>
{
    /**
     * The options of the generator.
     */
    private testOptions: T;

    /**
     * Initializes a new instance of the `TestGenerator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: T)
    {
        super(args, options);
        this.testOptions = options;
    }

    /**
     * Gets the options of the generator.
     */
    public get TestOptions(): T
    {
        return this.testOptions;
    }
}
