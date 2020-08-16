import { Generator, IComponentCollection, Question, IFileMapping } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions";
import { ITestGeneratorSettings } from "./ITestGeneratorSettings";
import { ITestOptions } from "./ITestOptions";

/**
 * Represents a test-generator.
 */
export class TestGenerator<TSettings extends ITestGeneratorSettings = ITestGeneratorSettings, TOptions extends ITestOptions = ITestOptions> extends Generator<TSettings>
{
    /**
     * The options of the generator.
     */
    private generatorOptions: Partial<TOptions> = {};

    /**
     * Initializes a new instance of the `TestGenerator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: ITestGeneratorOptions<TOptions>)
    {
        super(args, options);

        if (options.TestGeneratorOptions)
        {
            this.generatorOptions = options.TestGeneratorOptions;
        }
    }

    /**
     * Gets the options of the generator.
     */
    public get GeneratorOptions(): Partial<TOptions>
    {
        return this.generatorOptions;
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
    public get Components(): IComponentCollection<TSettings>
    {
        return this.generatorOptions.Components;
    }

    /**
     * @inheritdoc
     */
    public set Components(value: IComponentCollection<TSettings>)
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
    public get FileMappings(): Array<IFileMapping<TSettings>>
    {
        return this.generatorOptions.FileMappings;
    }

    /**
     * @inheritdoc
     */
    public set FileMappings(value: Array<IFileMapping<TSettings>>)
    {
        this.generatorOptions.FileMappings = value;
    }

    /**
     * Gets or sets the path to the root of the module.
     *
     * @param path
     * The path to set as the module-root.
     *
     * @returns
     * The path to the module-root.
     */
    public moduleRoot(path?: string): string
    {
        if (path)
        {
            this.ModuleRoot = path;
        }

        return this.ModuleRoot;
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
