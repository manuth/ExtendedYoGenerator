import Assert = require("assert");
import { Random } from "random-js";
import { IRunContext } from "../IRunContext";
import { ITestGeneratorOptions } from "../ITestGeneratorOptions";
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
            let testContext: TestContext<TestGenerator<any, IExampleOptions>, ITestGeneratorOptions<IExampleOptions>>;
            let options: IExampleOptions;
            let randomValue: string;

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
                });

            suite(
                "Generator",
                () =>
                {
                    let generator: TestGenerator<any, IExampleOptions>;

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
                "CreatePromise(value)",
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
                "CreateFunction(value)",
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
                "CreatePromiseFunction(value)",
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
                "ExecuteGenerator(options, runSettings)",
                () =>
                {
                    let runContext: IRunContext<TestGenerator<any, IExampleOptions>>;

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
                            runContext = testContext.ExecuteGenerator(
                                {
                                    TestGeneratorOptions: options
                                });

                            await runContext.toPromise();
                            Assert.strictEqual(runContext.generator.GeneratorOptions.testOption, options.testOption);
                        });
                });
        });
}
