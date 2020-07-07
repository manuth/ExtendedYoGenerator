import { ITestOptions } from "extended-generator/tests/ITestOptions";
import { TestGenerator } from "extended-generator/tests/TestGenerator";

/**
 * The test-generator.
 */
class Generator extends TestGenerator
{
    /**
     * Initializes a new instance of the `Generator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: ITestOptions)
    {
        super(args, options);
    }

    /**
     * @inheritdoc
     */
    public async prompting(): Promise<void>
    {
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public async writing(): Promise<void>
    {
        super.writing();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        this.log("The end");
    }
}

export = Generator;
