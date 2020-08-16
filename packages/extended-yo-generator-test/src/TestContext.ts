import { join } from "path";
import { Generator, GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import cloneDeep = require("lodash.clonedeep");
import { run, RunContextSettings } from "yeoman-test";
import { IRunContext } from "./IRunContext";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions";
import { ITestOptions } from "./ITestOptions";
import { TestGenerator } from "./TestGenerator";

/**
 * Represents a context for testing.
 */
export class TestContext<TGenerator extends Generator<any, TOptions> = Generator<IGeneratorSettings, GeneratorOptions & any>, TOptions extends GeneratorOptions = GeneratorOptions>
{
    /**
     * The default `TestContext<TGenerator, TOptions>` instance.
     */
    private static defaultInstance: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>> = null;

    /**
     * The directory of the generator.
     */
    private generatorDirectory: string;

    /**
     * An instance of the `RunContext` class that already has finished.
     */
    private finishedContext: IRunContext<TGenerator> = null;

    /**
     * A backup of the settings of the generator.
     */
    private settingsBackup: any;

    /**
     * Initializes a new instance of the `TestContext` class.
     *
     * @param generatorDirectory
     * The directory of the generator.
     */
    public constructor(generatorDirectory: string)
    {
        this.generatorDirectory = generatorDirectory;
    }

    /**
     * Gets the directory of the generator.
     */
    public get GeneratorDirectory(): string
    {
        return this.generatorDirectory;
    }

    /**
     * Gets the generator.
     */
    public get Generator(): Promise<TGenerator>
    {
        return (async () =>
        {
            if (this.finishedContext === null)
            {
                this.finishedContext = this.ExecuteGenerator();
                await this.finishedContext.toPromise();
                this.settingsBackup = cloneDeep(this.finishedContext.generator.Settings);
            }

            return this.finishedContext.generator;
        })();
    }

    /**
     * Gets the default instance of the `TestContext<TGenerator, TOptions>` class.
     */
    public static get Default(): TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>
    {
        if (this.defaultInstance === null)
        {
            this.defaultInstance = new TestContext(join(__dirname, "generators", "app"));
        }

        return this.defaultInstance;
    }

    /**
     * Resets the settings of the generator.
     */
    public async ResetSettings(): Promise<void>
    {
        if (this.finishedContext !== null)
        {
            let generator = await this.Generator;

            for (let key of Object.keys(generator.Settings))
            {
                delete generator.Settings[key];
            }

            Object.assign(generator.Settings, cloneDeep(this.settingsBackup));
        }
    }

    /**
     * Creates a promise resolving the specified `value`.
     *
     * @param value
     * The value to promisify.
     *
     * @returns
     * The promisified value.
     */
    public CreatePromise<T>(value: T): Promise<T>
    {
        return new Promise(
            (resolve) =>
            {
                resolve(value);
            });
    }

    /**
     * Nests the specified `value` into a function.
     *
     * @param value
     * The value to nest into a function.
     *
     * @returns
     * The value nested into a function.
     */
    public CreateFunction<T>(value: T): () => T
    {
        return () =>
        {
            return value;
        };
    }

    /**
     * Nests the promisified `value` into a function.
     *
     * @param value
     * The value to nest.
     *
     * @returns
     * The promisified value nested into a function.
     */
    public CreatePromiseFunction<T>(value: T): () => Promise<T>
    {
        return this.CreateFunction(this.CreatePromise(value));
    }

    /**
     * Executes the generator.
     *
     * @param options
     * The options for the generator.
     *
     * @param runSettings
     * The settings for executing the generator.
     *
     * @returns
     * The execution-context of the generator.
     */
    public ExecuteGenerator(options?: TOptions, runSettings?: RunContextSettings): IRunContext<TGenerator>
    {
        let result = run(this.GeneratorDirectory, runSettings) as IRunContext<TGenerator>;

        if (options)
        {
            result = result.withOptions(options);
        }

        return result;
    }

    /**
     * Releases all resources of this component.
     */
    public Dispose(): void
    {
        if ((this.finishedContext as any)?.settings?.tmpdir ?? false)
        {
            this.finishedContext.cleanTestDirectory();
        }
    }
}
