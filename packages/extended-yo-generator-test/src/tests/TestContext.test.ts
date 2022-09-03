import { deepStrictEqual, doesNotReject, notDeepEqual, ok, strictEqual } from "node:assert";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { GeneratorSettingKey, IGeneratorSettings } from "@manuth/extended-yo-generator";
import inquirer from "inquirer";
import cloneDeep from "lodash.clonedeep";
import { Random } from "random-js";
import helpers from "yeoman-test";
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
                            this.timeout(1 * 60 * 1000);
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
                nameof<TestContext>((context) => context.ResetSettings),
                () =>
                {
                    test(
                        "Checking whether settings are reset properly…",
                        async () =>
                        {
                            let generator = await testContext.Generator;
                            let originalSettings: IGeneratorSettings;
                            let customizedSettings: IGeneratorSettings;
                            originalSettings = cloneDeep(generator.Settings);
                            generator.Settings[GeneratorSettingKey.Components] ??= [];
                            generator.Settings[GeneratorSettingKey.Components].push(testContext.RandomString);
                            customizedSettings = cloneDeep(generator.Settings);
                            await testContext.ResetSettings();
                            notDeepEqual(generator.Settings, customizedSettings);
                            deepStrictEqual(generator.Settings, originalSettings);
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

                    test(
                        "Checking whether prompts which are registered in the constructor are replaced properly…",
                        async () =>
                        {
                            let prompts: inquirer.prompts.PromptCollection;
                            let mockedPrompts: inquirer.prompts.PromptCollection;
                            let context = new TestContext(join(fileURLToPath(new URL(".", import.meta.url)), "example"));
                            let runContext = context.ExecuteGenerator();

                            runContext.on(
                                "ready",
                                (generator: TestGenerator) =>
                                {
                                    prompts = { ...generator.env.adapter.promptModule.prompts };
                                });

                            await runContext.toPromise();
                            let generator = runContext.generator;
                            helpers.mockPrompt(generator, {});
                            mockedPrompts = { ...generator.env.adapter.promptModule.prompts };
                            helpers.restorePrompt(generator);

                            for (let promptName of Object.keys(generator.env.adapter.promptModule.prompts))
                            {
                                strictEqual(prompts[promptName].name, mockedPrompts[promptName].name);
                            }
                        });
                });
        });
}
