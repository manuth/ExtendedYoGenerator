import { Answers, Question } from "@manuth/extended-yo-generator";
import InputPrompt from "inquirer/lib/prompts/input.js";
import { ITestGeneratorOptions } from "../../ITestGeneratorOptions.js";
import { ITestOptions } from "../../ITestOptions.js";
import { TestGenerator } from "../../TestGenerator.js";

/**
 * Represents an example generator.
 */
export class ExampleGenerator extends TestGenerator
{
    /**
     * Initializes a new instance of the {@link ExampleGenerator `TestGenerator`} class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: ITestGeneratorOptions<ITestOptions>)
    {
        super(args, options);
        this.env.adapter.promptModule.registerPrompt(ExampleGenerator.PromptName, InputPrompt);
    }

    /**
     * Gets the name of the prompt to test.
     */
    public static get PromptName(): string
    {
        return "example";
    }

    /**
     * @inheritdoc
     */
    public override get Questions(): Array<Question<Answers>>
    {
        return [
            {
                name: "test"
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public override async prompting(): Promise<void>
    {
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public override async writing(): Promise<void>
    {
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public override async end(): Promise<void>
    {
        return super.end();
    }
}
