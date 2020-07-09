import Assert = require("assert");
import Path = require("path");
import { Random } from "random-js";
import { IRunContext } from "../IRunContext";
import { TestContext } from "../TestContext";
import { ITestOptions } from "./Generator/ITestOptions";
import { TestGenerator } from "./Generator/TestGenerator";

suite(
    "TestContext",
    () =>
    {
        let random: Random;
        let generatorDirectory: string;
        let testContext: TestContext<TestGenerator<ITestOptions>, ITestOptions>;
        let options: ITestOptions;
        let randomValue: string;

        suiteSetup(
            () =>
            {
                random = new Random();
                generatorDirectory = Path.join(__dirname, "Generator");
                testContext = new TestContext(generatorDirectory);
            });

        setup(
            () =>
            {
                options = {
                    testOption: random.string(15)
                };

                randomValue = random.string(10);
            });

        suite(
            "GeneratorDirectory",
            () =>
            {
                test(
                    "Checking whether the generator-directory is stored correctly…",
                    () =>
                    {
                        Assert.strictEqual(testContext.GeneratorDirectory, generatorDirectory);
                    });
            });

        suite(
            "Generator",
            () =>
            {
                let generator: TestGenerator<ITestOptions>;

                setup(
                    async () =>
                    {
                        generator = await testContext.Generator;
                    });

                test(
                    "Checking whether an instance of the specified generator can be retrieved…",
                    () =>
                    {
                        Assert.ok(generator instanceof TestGenerator);
                    });

                test(
                    "Checking whether the process for retrieving a generator is only executed once…",
                    async () =>
                    {
                        Assert.strictEqual(await testContext.Generator, generator);
                    });
            });

        suite(
            "Promise<T> CreatePromise<T>(T value)",
            () =>
            {
                test(
                    "Checking whether values can be wrapped in promises correctly…",
                    async () =>
                    {
                        Assert.strictEqual(await testContext.CreatePromise(randomValue), randomValue);
                    });
            });

        suite(
            "Function<T> CreateFunction<T>(T value)",
            () =>
            {
                test(
                    "Checking whether values can be wrapped in functions correctly",
                    () =>
                    {
                        Assert.strictEqual(testContext.CreateFunction(randomValue)(), randomValue);
                    });
            });

        suite(
            "Function<Promise<T>> CreatePromiseFunction<T>(T value)",
            () =>
            {
                test(
                    "Checking whether values can be wrapped in promises and functions correctly…",
                    async () =>
                    {
                        Assert.strictEqual(await testContext.CreatePromiseFunction(randomValue)(), randomValue);
                    });
            });

        suite(
            "IRunContext<TGenerator> ExecuteGenerator(TOptions options, RunContextSettings runSettings)",
            () =>
            {
                let runContext: IRunContext<TestGenerator<ITestOptions>>;

                setup(
                    () =>
                    {
                        runContext = testContext.ExecuteGenerator();
                    });

                test(
                    "Checking whether generators can be executed…",
                    async () =>
                    {
                        await Assert.doesNotReject(async () => runContext.toPromise());
                        Assert.ok(runContext.ran);
                        Assert.ok(runContext.generator instanceof TestGenerator);
                    });

                test(
                    "Checking whether options can be passed…",
                    async () =>
                    {
                        runContext = testContext.ExecuteGenerator(options);
                        await runContext.toPromise();
                        Assert.strictEqual(runContext.generator.TestOptions.testOption, options.testOption);
                    });
            });
    });
