import { join } from "path";
import { Generator, GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import cloneDeep = require("lodash.clonedeep");
import { Random } from "random-js";
import sinon = require("sinon");
import Environment = require("yeoman-environment");
import yeomanTest = require("yeoman-test");
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
     * A method for creating an environment.
     */
    private envFactory: typeof Environment["createEnv"];

    /**
     * The mock of the `yeoman-environment`-creation.
     */
    private envMock: sinon.SinonStub<unknown[], unknown> = null;

    /**
     * The directory of the generator.
     */
    private generatorDirectory: string;

    /**
     * A component for creating random literals.
     */
    private random: Random = new Random();

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
     *
     * @param envFactory
     * A component for creating `yeoman-environment`s.
     */
    public constructor(generatorDirectory: string, envFactory?: typeof Environment["createEnv"])
    {
        this.envFactory = envFactory ?? ((...params) => Environment.createEnv(...params));
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
     * Gets a component for creating random literals.
     */
    public get Random(): Random
    {
        return this.random;
    }

    /**
     * Gets a random string.
     */
    public get RandomString(): string
    {
        return this.Random.string(10);
    }

    /**
     * Gets a random object.
     */
    public get RandomObject(): any
    {
        return {
            randomValue: this.RandomString
        };
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
    public ExecuteGenerator(options?: TOptions, runSettings?: yeomanTest.RunContextSettings): IRunContext<TGenerator>
    {
        if (!this.envMock && this.envFactory)
        {
            this.envMock = sinon.stub(yeomanTest as any as typeof Environment, "createEnv").callsFake(
                (...params) =>
                {
                    return this.envFactory(...params);
                });
        }

        let result = yeomanTest.run(this.GeneratorDirectory, runSettings) as IRunContext<TGenerator>;

        if (options)
        {
            result = result.withOptions(options);
        }

        result.toPromise().finally(
            () =>
            {
                this.envMock.restore();
                this.envMock = null;
            });

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
