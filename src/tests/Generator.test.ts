import Assert = require("assert");
import Path = require("upath");
import { GeneratorSetting } from "..";
import { IRunContext } from "./IRunContext";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions";
import { TestContext } from "./TestContext";
import { TestGenerator } from "./TestGenerator";

/**
 * Registers the generator-tests.
 *
 * @param context
 * The context to use.
 */
export function GeneratorTests(context: TestContext): void
{
    suite(
        "Generator",
        () =>
        {
            let generator: TestGenerator;
            let generatorOptions: ITestGeneratorOptions = {};
            let testPath = "this-is-a-test.txt";
            let runContext: IRunContext<TestGenerator>;

            /**
             * Asserts a file-path.
             *
             * @param actual
             * The actual path.
             *
             * @param expected
             * The expected path.
             */
            function AssertPath(actual: string, expected: string): void
            {
                Assert.strictEqual(ProcessPath(actual), ProcessPath(expected));
            }

            /**
             * Resolves and normalizes a path for better comparsion.
             *
             * @param path
             * The path to process.
             *
             * @returns
             * The processed path.
             */
            function ProcessPath(path: string): string
            {
                return Path.normalize(Path.resolve(path));
            }

            suiteSetup(
                async () =>
                {
                    runContext = context.ExecuteGenerator({ testGeneratorOptions: generatorOptions });
                    await runContext.toPromise();
                    generator = runContext.generator;
                });

            setup(
                () =>
                {
                    generatorOptions.TemplateRoot = null;
                    generatorOptions.Components = null;
                    generatorOptions.Questions = null;
                });

            suite(
                "General",
                () =>
                {
                    let generatorOptions: ITestGeneratorOptions;

                    setup(
                        () =>
                        {
                            generatorOptions = {
                                TemplateRoot: "test",
                                Questions: [
                                    {
                                        name: "test",
                                        message: "test",
                                        default: "test"
                                    }
                                ],
                                Components: {
                                    Question: "test",
                                    Categories: [
                                        {
                                            DisplayName: "test",
                                            Components: [
                                                {
                                                    ID: "test1",
                                                    DisplayName: "Test 1",
                                                    FileMappings: [],
                                                    DefaultEnabled: true,
                                                    Questions: [
                                                        {
                                                            name: "additional1",
                                                            default: "test"
                                                        }
                                                    ]
                                                },
                                                {
                                                    ID: "test2",
                                                    DisplayName: "Test 2",
                                                    FileMappings: [],
                                                    DefaultEnabled: false,
                                                    Questions: [
                                                        {
                                                            name: "additional2",
                                                            default: "test"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            };
                        });

                    test(
                        "Checking whether the generator can be executed…",
                        async function()
                        {
                            this.enableTimeouts(false);
                            await context.ExecuteGenerator({ testGeneratorOptions: generatorOptions }).toPromise();
                        });
                });

            suite(
                "modulePath(...path)",
                () =>
                {
                    test(
                        "Checking whether `modulePath(...path)` resolves to the root of the generator's module…",
                        () =>
                        {
                            AssertPath(generator.modulePath(testPath), Path.join(context.GeneratorDirectory, testPath));
                        });
                });

            suite(
                "templatePath(...path)",
                () =>
                {
                    let relativePath: string;

                    suiteSetup(
                        () =>
                        {
                            relativePath = Path.relative(ProcessPath(Path.join(context.GeneratorDirectory)), ProcessPath(generator.templatePath()));
                        });

                    test(
                        "Checking whether the template-path is a sub-directory of the module…",
                        () =>
                        {
                            Assert.ok(!Path.isAbsolute(relativePath));
                            Assert.ok(!relativePath.startsWith(".."));
                        });

                    test(
                        "Checking whether `TemplateRoot` is optional…",
                        () =>
                        {
                            generatorOptions.TemplateRoot = null;
                            Assert.doesNotThrow(() => generator.templatePath());
                        });

                    test(
                        "Checking whether the template-path resolves to the specified `TemplateRoot`…",
                        () =>
                        {
                            generatorOptions.TemplateRoot = "Test";
                            AssertPath(generator.templatePath(testPath), Path.join(context.GeneratorDirectory, relativePath, generatorOptions.TemplateRoot, testPath));
                        });
                });

            suite(
                "Components",
                () =>
                {
                    let generator: TestGenerator;
                    let generatorOptions: ITestGeneratorOptions = {};
                    let defaultID: string;
                    let hiddenID: string;
                    let defaultQuestionID: string;
                    let hiddenQuestionID: string;
                    let defaultValue: string;
                    let fileMappingExecuted: boolean;

                    suiteSetup(
                        async () =>
                        {
                            defaultID = "default-component";
                            hiddenID = "non-default-component";
                            defaultQuestionID = "this-question-has-a-default-value";
                            hiddenQuestionID = "this-question-does-not-appear-in-the-results";
                            defaultValue = "This is the default value";
                            fileMappingExecuted = false;

                            generatorOptions.Components = {
                                Question: "Is this just a test?",
                                Categories: [
                                    {
                                        DisplayName: "Yes, it is!",
                                        Components: [
                                            {
                                                ID: defaultID,
                                                DisplayName: "Awesome stuff, dude",
                                                DefaultEnabled: true,
                                                FileMappings: [
                                                    {
                                                        Destination: null,
                                                        Processor: () =>
                                                        {
                                                            fileMappingExecuted = true;
                                                        }
                                                    }
                                                ],
                                                Questions: [
                                                    {
                                                        type: "input",
                                                        name: defaultQuestionID,
                                                        message: "Some more info, pls",
                                                        default: defaultValue
                                                    }
                                                ]
                                            },
                                            {
                                                ID: hiddenID,
                                                DisplayName: "Shhh - wanna have some of this, too?",
                                                DefaultEnabled: false,
                                                FileMappings: [],
                                                Questions: [
                                                    {
                                                        type: "input",
                                                        name: hiddenQuestionID,
                                                        message: "Anwer me!",
                                                        default: "default value"
                                                    }
                                                ]
                                            },
                                            {
                                                ID: hiddenID,
                                                DisplayName: "This component doesn't have `DefaultEnabled` set.",
                                                FileMappings: [],
                                                Questions: [
                                                    {
                                                        type: "input",
                                                        name: hiddenQuestionID,
                                                        message: "Test",
                                                        default: "default"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            };

                            let runContext = context.ExecuteGenerator({ testGeneratorOptions: generatorOptions });
                            await runContext.toPromise();
                            generator = runContext.generator;
                        });

                    test(
                        "Checking whether only default components are selected by default…",
                        () =>
                        {
                            Assert.strictEqual(generator.Settings[GeneratorSetting.Components].length, 1);
                            Assert.ok(generator.Settings[GeneratorSetting.Components].includes(defaultID));
                            Assert.ok(!generator.Settings[GeneratorSetting.Components].includes(hiddenID));
                        });

                    test(
                        "Checking whether additional questions are asked, only if components are selected…",
                        () =>
                        {
                            Assert.ok(defaultQuestionID in generator.Settings);
                            Assert.ok(!(hiddenQuestionID in generator.Settings));
                        });

                    test(
                        "Checking whether default values are applied…",
                        () =>
                        {
                            Assert.strictEqual(generator.Settings[defaultQuestionID], defaultValue);
                        });

                    test(
                        "Checking whether file-mappings are executed…",
                        () =>
                        {
                            Assert.ok(fileMappingExecuted);
                        });
                });

            suite(
                "Questions",
                () =>
                {
                    let generator: TestGenerator;
                    let generatorOptions: ITestGeneratorOptions = {};
                    let defaultID: string;
                    let hiddenID: string;
                    let defaultValue: string[];

                    suiteSetup(
                        async () =>
                        {
                            defaultID = "this-is-a-default-question";
                            hiddenID = "this-is-a-hidden-question";
                            defaultValue = ["a"];

                            generatorOptions.Questions = [
                                {
                                    type: "list",
                                    name: defaultID,
                                    choices: [
                                        {
                                            value: "a",
                                            checked: true
                                        },
                                        {
                                            value: "b",
                                            checked: true
                                        }
                                    ],
                                    default: defaultValue
                                },
                                {
                                    type: "checkbox",
                                    name: hiddenID,
                                    default: defaultValue,
                                    when: false
                                }
                            ];

                            let runContext = context.ExecuteGenerator({ testGeneratorOptions: generatorOptions });
                            await runContext.toPromise();
                            generator = runContext.generator;
                        });

                    test(
                        "Checking whether only settings for enabled questions are present…",
                        () =>
                        {
                            Assert.ok(defaultID in generator.Settings);
                            Assert.ok(!(hiddenID in generator.Settings));
                        });

                    test(
                        "Checking whether default values are applied…",
                        () =>
                        {
                            Assert.strictEqual(generator.Settings[defaultID], defaultValue);
                        });
                });
        });
}
