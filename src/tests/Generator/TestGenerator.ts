import { Generator, IComponentCollection, Question } from "../..";
import { IFileMapping } from "../../Components/IFileMapping";
import { IGeneratorSettings } from "../../IGeneratorSettings";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions";
import { ITestOptions } from "./ITestOptions";

/**
 * Represents a test-generator.
 */
export class TestGenerator extends Generator<IGeneratorSettings & Record<string, any>>
{
    /**
     * The options of the generator.
     */
    private generatorOptions: ITestGeneratorOptions = {};

    /**
     * Initializes a new instance of the `TestGenerator` class.
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

        if (options.testGeneratorOptions)
        {
            this.generatorOptions = options.testGeneratorOptions;
        }
    }

    /**
     * Gets or sets the name of the root of the template-folder.
     */
    public get TemplateRoot(): string
    {
        return this.generatorOptions.TemplateRoot;
    }

    /**
     * @inheritdoc
     */
    public set TemplateRoot(value: string)
    {
        this.generatorOptions.TemplateRoot = value;
    }

    /**
     * Gets or sets the components provided by the generator.
     */
    public get Components(): IComponentCollection<IGeneratorSettings>
    {
        return this.generatorOptions.Components;
    }

    /**
     * @inheritdoc
     */
    public set Components(value: IComponentCollection<IGeneratorSettings>)
    {
        this.generatorOptions.Components = value;
    }

    /**
     * Gets the questions to ask before executing the generator.
     */
    public get Questions(): Question[]
    {
        return this.generatorOptions.Questions;
    }

    /**
     * @inheritdoc
     */
    public set Questions(value: Question[])
    {
        this.generatorOptions.Questions = value;
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Array<IFileMapping<IGeneratorSettings>>
    {
        return this.generatorOptions.FileMappings;
    }

    /**
     * @inheritdoc
     */
    public set FileMappings(value: Array<IFileMapping<IGeneratorSettings>>)
    {
        this.generatorOptions.FileMappings = value;
    }

    /**
     * Gathers all information for executing the generator and saves them to the `Settings`.
     */
    public async prompting(): Promise<void>
    {
        this.log("Hi");
        return super.prompting();
    }

    /**
     * Writes all files for the components.
     */
    public async writing(): Promise<void>
    {
        super.writing();
    }

    /**
     * Finalizes the generation-process.
     */
    public async end(): Promise<void>
    {
        this.log("The end");
    }
}
