import { TestGenerator } from "extended-generator/lib/tests/TestGenerator";
import { ITestOptions } from "extended-generator/lib/tests/ITestOptions";

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
    public async prompting()
    {
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public async writing()
    {
        super.writing();
    }

    /**
     * @inheritdoc
     */
    public async end()
    {
        this.log("The end");
    }
}

export = Generator;
