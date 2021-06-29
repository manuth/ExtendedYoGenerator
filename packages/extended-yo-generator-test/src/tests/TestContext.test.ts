import { doesNotReject, ok, strictEqual } from "assert";
import { Random } from "random-js";
import { IRunContext } from "../IRunContext";
import { ITestGeneratorOptions } from "../ITestGeneratorOptions";
import { ITestGeneratorSettings } from "../ITestGeneratorSettings";
import { TestContext } from "../TestContext";
import { TestGenerator } from "../TestGenerator";
import { IExampleOptions } from "./IExampleOptions";

/**
 * Registers tests for the {@link TestContext `TestContext<TGenerator, TOptions>`} class.
 */
export function TestContextTests(): void
{
    suite(
        nameof(TestContext),
        () =>
        {
            let random: Random;
            let testContext: TestContext<TestGenerator<ITestGeneratorSettings, IExampleOptions>, ITestGeneratorOptions<IExampleOptions>>;
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
                nameof<TestContext>((context) => context.Generator),
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
                nameof<TestContext>((context) => context.CreatePromise),
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
                nameof<TestContext>((context) => context.CreateFunction),
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
                nameof<TestContext>((context) => context.CreatePromiseFunction),
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
                nameof<TestContext>((context) => context.ExecuteGenerator),
                () =>
                {
                    let runContext: IRunContext<TestGenerator<ITestGeneratorSettings, IExampleOptions>>;

                    setup(
                        () =>
                        {
                            runContext = testContext.ExecuteGenerator();
                        });

                    test(
                        "Checking whether generators can be executed…",
                        async () =>
                        {
                            await doesNotReject(async () => runContext.toPromise());
                            ok(runContext.ran);
                            ok(runContext.generator instanceof TestGenerator);
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
                            strictEqual(runContext.generator.GeneratorOptions.testOption, options.testOption);
                        });
                });
        });
}
