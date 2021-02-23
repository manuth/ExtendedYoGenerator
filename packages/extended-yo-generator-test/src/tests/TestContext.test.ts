import { doesNotReject, ok, strictEqual } from "assert";
import { randexp } from "randexp";
import { Random } from "random-js";
import Environment = require("yeoman-environment");
import { ITestGeneratorOptions } from "../ITestGeneratorOptions";
import { ITestGeneratorSettings } from "../ITestGeneratorSettings";
import { TestContext } from "../TestContext";
import { TestGenerator } from "../TestGenerator";
import { IExampleOptions } from "./IExampleOptions";

/**
 * Registers tests for the `TestContext` class.
 */
export function TestContextTests(): void
{
    suite(
        "TestContext",
        () =>
        {
            let random: Random;
            let testContext: TestContext<TestGenerator<ITestGeneratorSettings, IExampleOptions>, ITestGeneratorOptions<IExampleOptions>>;
            let options: IExampleOptions;
            let randomValue: string;
            let globalEnvFactory: EnvFactory;
            let customEnvFactory: EnvFactory;

            /**
             * Represents a component for creating `yeoman-environment`s.
             */
            type EnvFactory = typeof Environment["createEnv"] & {
                /**
                 * Gets the version of the environment-factory.
                 */
                version: string;
            };

            /**
             * Creates an environment-factory.
             *
             * @returns
             * A component for creating `yeoman-environment`s.
             */
            function CreateEnvFactory(): EnvFactory
            {
                let result = ((...params) =>
                {
                    let env = Environment.createEnv(...params);
                    env.getVersion = () => result.version;
                    return env;
                }) as EnvFactory;

                result.version = `${Environment.createEnv().getVersion()}${randexp("\\d+")}`;
                return result;
            }

            suiteSetup(
                () =>
                {
                    random = new Random();
                    testContext = TestContext.Default;
                });

            setup(
                () =>
                {
                    options = {
                        testOption: random.string(15)
                    };

                    randomValue = random.string(10);
                    globalEnvFactory = CreateEnvFactory();

                    do
                    {
                        customEnvFactory = CreateEnvFactory();
                    }
                    while (globalEnvFactory.version === customEnvFactory.version);
                });

            suite(
                "constructor",
                () =>
                {
                    let testContext: TestContext;

                    setup(
                        () =>
                        {
                            testContext = new TestContext(TestContext.Default.GeneratorDirectory, globalEnvFactory);
                        });

                    test(
                        "Checking whether a test-context without an `envFactory` can be initialized and used…",
                        async () =>
                        {
                            await doesNotReject(() => new TestContext(TestContext.Default.GeneratorDirectory).ExecuteGenerator());
                        });

                    test(
                        "Checking whether the passed `envFactory` is being used…",
                        async () =>
                        {
                            strictEqual((await testContext.ExecuteGenerator()).env.getVersion(), globalEnvFactory.version);
                        });
                });

            suite(
                "Generator",
                () =>
                {
                    let generator: TestGenerator<ITestGeneratorSettings, IExampleOptions>;

                    setup(
                        async function()
                        {
                            this.timeout(0);
                            generator = await testContext.Generator;
                        });

                    test(
                        "Checking whether an instance of the specified generator can be retrieved…",
                        () =>
                        {
                            ok(generator instanceof TestGenerator);
                        });

                    test(
                        "Checking whether the process for retrieving a generator is only executed once…",
                        async () =>
                        {
                            strictEqual(await testContext.Generator, generator);
                        });
                });

            suite(
                "CreatePromise",
                () =>
                {
                    test(
                        "Checking whether values can be wrapped in promises correctly…",
                        async () =>
                        {
                            strictEqual(await testContext.CreatePromise(randomValue), randomValue);
                        });
                });

            suite(
                "CreateFunction",
                () =>
                {
                    test(
                        "Checking whether values can be wrapped in functions correctly",
                        () =>
                        {
                            strictEqual(testContext.CreateFunction(randomValue)(), randomValue);
                        });
                });

            suite(
                "CreatePromiseFunction",
                () =>
                {
                    test(
                        "Checking whether values can be wrapped in promises and functions correctly…",
                        async () =>
                        {
                            strictEqual(await testContext.CreatePromiseFunction(randomValue)(), randomValue);
                        });
                });

            suite(
                "ExecuteGenerator",
                () =>
                {
                    test(
                        "Checking whether generators can be executed…",
                        async () =>
                        {
                            let runContext = testContext.ExecuteGenerator();
                            await doesNotReject(async () => runContext.toPromise());
                            ok(runContext.ran);
                            ok(runContext.generator instanceof TestGenerator);
                        });

                    test(
                        "Checking whether options can be passed…",
                        async () =>
                        {
                            let runContext = testContext.ExecuteGenerator(
                                {
                                    TestGeneratorOptions: options
                                });

                            await runContext.toPromise();
                            strictEqual(runContext.generator.GeneratorOptions.testOption, options.testOption);
                        });
                });
        });
}
