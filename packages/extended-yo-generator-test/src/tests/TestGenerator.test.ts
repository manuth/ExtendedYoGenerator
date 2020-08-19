import Assert = require("assert");
import { Random } from "random-js";
import { IRunContext } from "../IRunContext";
import { ITestGeneratorOptions } from "../ITestGeneratorOptions";
import { ITestOptions } from "../ITestOptions";
import { TestContext } from "../TestContext";
import { TestGenerator } from "../TestGenerator";

/**
 * Registers tests for the `TestGenerator` class.
 */
export function TestGeneratorTests(): void
{
    suite(
        "TestGenerator",
        () =>
        {
            let random: Random;
            let context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>;
            let options: ITestOptions;
            let generator: TestGenerator;
            let randomValue: Generator<string, string>;

            suiteSetup(
                async () =>
                {
                    let runContext: IRunContext<TestGenerator>;
                    random = new Random();
                    context = TestContext.Default;
                    options = {};

                    runContext = context.ExecuteGenerator(
                        {
                            TestGeneratorOptions: options
                        });

                    await runContext.toPromise();
                    generator = runContext.generator;

                    randomValue = (function*()
                    {
                        while (true)
                        {
                            yield random.string(20);
                        }
                    })();
                });

            setup(
                () =>
                {
                    options.TemplateRoot = null;
                    options.Questions = [];
                    options.Components = null;
                    options.FileMappings = [];
                });

            suite(
                "Path",
                () =>
                {
                    test(
                        "Checking whether a generator can be instantiated from the specified path…",
                        async () =>
                        {
                            let generator: TestGenerator;

                            await Assert.doesNotReject(
                                async () =>
                                {
                                    generator = (await context.Generator).env.create(TestGenerator.Path) as any;
                                });

                            Assert.ok(generator instanceof TestGenerator);
                        });
                });

            suite(
                "GeneratorOptions",
                () =>
                {
                    test(
                        "Checking whether generator-options are applied correctly…",
                        () =>
                        {
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

                            Assert.strictEqual(generator.TemplateRoot, options.TemplateRoot);
                            Assert.deepStrictEqual(generator.Questions, options.Questions);
                            Assert.deepStrictEqual(generator.Components, options.Components);
                            Assert.deepStrictEqual(generator.FileMappings, options.FileMappings);
                        });
                });
        });
}
