import Path = require("path");
import { writeJSON, remove } from "fs-extra";
import { run, RunContext, RunContextSettings } from "yeoman-test";
import { IGenerator } from "../IGenerator";
import { TestGenerator } from "./TestGenerator";
import { spawnSync } from "child_process";
import npmWhich = require("npm-which");
import { IRunContext } from "./IRunContext";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions";

/**
 * Represents a context for testing.
 */
export class TestContext
{
    /**
     * The directory of the generator.
     */
    private generatorDirectory = Path.join(__dirname, "..", "..", "test", "TestGenerator");

    /**
     * An instance of the `RunContext` class that already has finished.
     */
    private finishedContext: IRunContext<TestGenerator> = null;

    /**
     * Initializes a new instance of the `TestContext` class.
     */
    public constructor()
    { }

    /**
     * Gets the directory of the generator.
     */
    public get GeneratorDirectory()
    {
        return this.generatorDirectory;
    }

    /**
     * Gets the generator.
     */
    public get Generator(): Promise<TestGenerator>
    {
        return (async () =>
        {
            if (this.finishedContext === null)
            {
                this.finishedContext = this.ExecuteGenerator();
                await this.finishedContext.toPromise();
            }

            return this.finishedContext.generator;
        })();
    }

    /**
     * Initializes the context.
     */
    public async Initialize(): Promise<void>
    {
        spawnSync(
            npmWhich(this.GeneratorDirectory).sync("npm"),
            [
                "install"
            ],
            {
                cwd: this.GeneratorDirectory
            });

        spawnSync(
            npmWhich(this.GeneratorDirectory).sync("tsc"),
            {
                cwd: this.GeneratorDirectory
            });
    }

    /**
     * Disposes the context.
     */
    public async Dispose(): Promise<void>
    { }

    /**
     * Creates a promise resolving the specified `value`.
     *
     * @param value
     * The value to promisify.
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
     */
    public CreateFunction<T>(value: T): () => T
    {
        return () =>
        {
            return value;
        }
    }

    /**
     * Nests the promisified `value` into a function.
     *
     * @param value
     * The value to nest.
     */
    public CreatePromiseFunction<T>(value: T): () => Promise<T>
    {
        return this.CreateFunction(this.CreatePromise(value));
    }

    /**
     * Executes the generator.
     */
    public ExecuteGenerator(options?: ITestGeneratorOptions, runSettings?: RunContextSettings): IRunContext<TestGenerator>
    {
        let result = run(this.GeneratorDirectory, runSettings) as IRunContext<TestGenerator>;

        if (options)
        {
            result = result.withOptions(options);
        }

        return result;
    }
}
