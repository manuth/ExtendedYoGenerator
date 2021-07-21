import { deepStrictEqual, doesNotReject, notStrictEqual, ok, strictEqual } from "assert";
import { IRunContext } from "../IRunContext";
import { ITestGeneratorOptions } from "../ITestGeneratorOptions";
import { ITestOptions } from "../ITestOptions";
import { TestContext } from "../TestContext";
import { TestGenerator } from "../TestGenerator";

/**
 * Registers tests for the {@link TestGenerator `TestGenerator<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TestGeneratorTests(context: TestContext): void
{
    suite(
        nameof(TestGenerator),
        () =>
        {
            let context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>;
            let options: ITestOptions;
            let generator: TestGenerator;
            let randomValue: Generator<string, string>;

            suiteSetup(
                async function()
                {
                    this.timeout(2 * 1000);
                    let runContext: IRunContext<TestGenerator>;
                    context = TestContext.Default;
                    options = {};

                    runContext = context.ExecuteGenerator(
                        {
                            TestGeneratorOptions: options
                        });

                    await runContext.toPromise();
                    generator = runContext.generator;
                });

            setup(
                () =>
                {
                    options.TemplateRoot = null;
                    options.Questions = [];
                    options.Components = null;
                    options.FileMappings = [];

                    randomValue = (function*()
                    {
                        let i = 1;

                        while (true)
                        {
                            yield context.Random.string(i++);
                        }
                    })();
                });

            suite(
                nameof(TestGenerator.Path),
                () =>
                {
                    test(
                        "Checking whether a generator can be instantiated from the specified path…",
                        async function()
                        {
                            this.timeout(50 * 1000);
                            this.slow(25 * 1000);
                            let generator: TestGenerator;

                            await doesNotReject(
                                async () =>
                                {
                                    generator = (await context.Generator).env.create(TestGenerator.Path) as any;
                                });

                            ok(generator instanceof TestGenerator);
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.options),
                () =>
                {
                    test(
                        "Checking whether generator-options are applied correctly…",
                        function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            options.TemplateRoot = randomValue.next().value;

                            options.Questions = [
                                {
                                    type: "input",
                                    message: randomValue.next().value
                                }
                            ];

                            options.Components = {
                                Question: randomValue.next().value,
                                Categories: []
                            };

                            options.FileMappings = [
                                {
                                    Destination: randomValue.next().value
                                }
                            ];

                            strictEqual(generator.TemplateRoot, options.TemplateRoot);
                            deepStrictEqual(generator.Questions, options.Questions);
                            deepStrictEqual(generator.Components, options.Components);
                            deepStrictEqual(generator.FileMappings, options.FileMappings);
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.moduleRoot),
                () =>
                {
                    let moduleRoot: string;

                    suiteSetup(
                        () =>
                        {
                            moduleRoot = generator.modulePath();
                        });

                    suiteTeardown(
                        () =>
                        {
                            generator.moduleRoot(moduleRoot);
                        });

                    test(
                        "Checking whether the module-root of the generator can be changed…",
                        () =>
                        {
                            generator.moduleRoot(context.RandomString);
                            notStrictEqual(moduleRoot, generator.modulePath());
                        });

                    test(
                        "Checking whether the module-root can be queried using this method…",
                        () =>
                        {
                            strictEqual(generator.moduleRoot(), generator.modulePath());
                        });
                });
        });
}
