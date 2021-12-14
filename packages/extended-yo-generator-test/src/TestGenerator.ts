import { Generator, IComponentCollection, IFileMapping, IGeneratorSettings, Question } from "@manuth/extended-yo-generator";
import { join } from "upath";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions";
import { ITestOptions } from "./ITestOptions";

/**
 * Represents a test-generator.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TestGenerator<TSettings extends IGeneratorSettings = IGeneratorSettings, TOptions extends ITestOptions<TSettings> = ITestOptions<TSettings>> extends Generator<TSettings, ITestGeneratorOptions<TOptions>>
{
    /**
     * The options of the generator.
     */
    private generatorOptions: Partial<TOptions> = {};

    /**
     * Initializes a new instance of the {@link TestGenerator `TestGenerator<TSettings, TOptions>`} class.
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
     * Gets the path pointing to this generator.
     */
    public static get Path(): string
    {
        return join(__dirname, "generators", "app");
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
    public override get TemplateRoot(): string
    {
        return this.generatorOptions.TemplateRoot;
    }

    /**
     * @inheritdoc
     */
    public override set TemplateRoot(value: string)
    {
        this.generatorOptions.TemplateRoot = value;
    }

    /**
     * Gets or sets the components provided by the generator.
     */
    public override get Components(): IComponentCollection<TSettings, ITestGeneratorOptions<TOptions>>
    {
        return this.generatorOptions.Components;
    }

    /**
     * @inheritdoc
     */
    public override set Components(value: IComponentCollection<TSettings, ITestGeneratorOptions<TOptions>>)
    {
        this.generatorOptions.Components = value as IComponentCollection<TSettings, ITestGeneratorOptions<ITestOptions<TSettings>>>;
    }

    /**
     * Gets the questions to ask before executing the generator.
     */
    public override get Questions(): Question[]
    {
        return this.generatorOptions.Questions;
    }

    /**
     * @inheritdoc
     */
    public override set Questions(value: Question[])
    {
        this.generatorOptions.Questions = value;
    }

    /**
     * @inheritdoc
     */
    public override get FileMappings(): Array<IFileMapping<TSettings, ITestGeneratorOptions<TOptions>>>
    {
        return this.generatorOptions.FileMappings;
    }

    /**
     * @inheritdoc
     */
    public override set FileMappings(value: Array<IFileMapping<TSettings, ITestGeneratorOptions<TOptions>>>)
    {
        this.generatorOptions.FileMappings = value as Array<IFileMapping<TSettings, ITestGeneratorOptions<ITestOptions<TSettings>>>>;
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
     * Gathers all information for executing the generator and saves them to the {@link TestGenerator.Settings `Settings`}.
     */
    public override async prompting(): Promise<void>
    {
        this.log("Hi");
        return super.prompting();
    }

    /**
     * Writes all files for the components.
     */
    public override async writing(): Promise<void>
    {
        super.writing();
    }

    /**
     * Finalizes the generation-process.
     */
    public override async end(): Promise<void>
    {
        this.log("The end");
    }
}
