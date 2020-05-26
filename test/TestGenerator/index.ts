import { TestGenerator } from "extended-generator/lib/tests/TestGenerator";

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
    public constructor(args: string | string[], options: {})
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
