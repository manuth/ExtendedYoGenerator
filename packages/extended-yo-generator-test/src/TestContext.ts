import { Generator } from "@manuth/extended-yo-generator";
import { run, RunContextSettings } from "yeoman-test";
import { IRunContext } from "./IRunContext";

/**
 * Represents a context for testing.
 */
export class TestContext<TGenerator extends Generator<any> = Generator<any>, TOptions extends Record<string, unknown> = Record<string, unknown>>
{
    /**
     * The directory of the generator.
     */
    private generatorDirectory: string;

    /**
     * An instance of the `RunContext` class that already has finished.
     */
    private finishedContext: IRunContext<TGenerator> = null;

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
            }

            return this.finishedContext.generator;
        })();
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
}
