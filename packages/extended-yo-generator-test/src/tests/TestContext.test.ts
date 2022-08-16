import { doesNotReject, ok, strictEqual } from "node:assert";
import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Random } from "random-js";
import { IRunContext } from "../IRunContext.js";
import { ITestGeneratorOptions } from "../ITestGeneratorOptions.js";
import { TestContext } from "../TestContext.js";
import { TestGenerator } from "../TestGenerator.js";
import { IExampleOptions } from "./IExampleOptions.js";

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
            let testContext: TestContext<TestGenerator<IGeneratorSettings, IExampleOptions>, ITestGeneratorOptions<IExampleOptions>>;
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
                    let generator: TestGenerator<IGeneratorSettings, IExampleOptions>;

                    setup(
                        async function()
                        {
                            this.timeout(30 * 1000);
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
                nameof<TestContext>((context) => context.CreateGenerator),
                () =>
                {
                    test(
                        "Checking whether generators can be created without an error…",
                        async function()
                        {
                            this.timeout(10 * 1000);
                            this.slow(5 * 1000);
                            ok(testContext.CreateGenerator(TestGenerator) instanceof TestGenerator);
                        });

                    test(
                        "Checking whether custom options and arguments can be passed to the generator…",
                        () =>
                        {
                            let testOption = testContext.RandomString;
                            let optionValue = testContext.RandomObject;
                            let testArg = testContext.RandomString;

                            let generator = testContext.CreateGenerator(
                                TestGenerator,
                                [testArg],
                                {
                                    [testOption]: optionValue
                                });

                            ok(generator.args.includes(testArg));
                            ok(testOption in generator.options);
                            strictEqual(generator.options[testOption], optionValue);
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
                    let runContext: IRunContext<TestGenerator<IGeneratorSettings, IExampleOptions>>;

                    setup(
                        async function()
                        {
                            this.timeout(2 * 1000);
                            runContext = testContext.ExecuteGenerator();
                        });

                    test(
                        "Checking whether generators can be executed…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await doesNotReject(async () => runContext.toPromise());
                            ok(runContext.ran);
                            ok(runContext.generator instanceof TestGenerator);
                        });

                    test(
                        "Checking whether options can be passed…",
                        async function()
                        {
                            this.slow(1 * 1000);
                            this.timeout(2 * 1000);

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
