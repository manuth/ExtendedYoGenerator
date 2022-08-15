import { doesNotThrow, notStrictEqual, ok, strictEqual } from "node:assert";
import { IRunContext, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempDirectory, TempFile } from "@manuth/temp-files";
import fs from "fs-extra";
import { pkgUpSync } from "pkg-up";
import path from "upath";
import { Generator } from "../Generator.js";
import { GeneratorSettingKey } from "../GeneratorSettingKey.js";

const { readFile, writeFile } = fs;
const { dirname, isAbsolute, join, normalize, relative, resolve } = path;

/**
 * Registers tests for the TSGenerator-generator.
 *
 * @param context
 * The context to use.
 */
export function ExtendedGeneratorTests(context: TestContext<TestGenerator<ITestGeneratorSettings>, ITestGeneratorOptions<ITestOptions<ITestGeneratorSettings>>>): void
{
    suite(
        nameof(Generator),
        () =>
        {
            let moduleRoot: string;
            let generator: TestGenerator<ITestGeneratorSettings>;
            let options: ITestOptions<ITestGeneratorSettings> = {};
            let testPath = "this-is-a-test.txt";
            let runContext: IRunContext<TestGenerator<ITestGeneratorSettings>>;

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
                strictEqual(ProcessPath(actual), ProcessPath(expected));
            }

            /**
             * Resolves and normalizes a path for better comparison.
             *
             * @param path
             * The path to process.
             *
             * @returns
             * The processed path.
             */
            function ProcessPath(path: string): string
            {
                return normalize(resolve(path));
            }

            suiteSetup(
                async function()
                {
                    this.timeout(2 * 1000);
                    moduleRoot = dirname(pkgUpSync({ cwd: context.GeneratorDirectory }));

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
                    options.Components = null;
                    options.Questions = null;
                });

            suite(
                "General",
                () =>
                {
                    let options: ITestOptions<ITestGeneratorSettings>;

                    setup(
                        () =>
                        {
                            options = {
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
                            this.slow(1 * 1000);
                            this.timeout(2 * 1000);
                            await context.ExecuteGenerator({ TestGeneratorOptions: options }).toPromise();
                        });

                    test(
                        `Checking whether dependencies are installed if the \`package.json\` is changed after changing the \`${nameof<TestGenerator>((g) => g.destinationRoot)}\`…`,
                        async function()
                        {
                            this.slow(10 * 1000);
                            this.timeout(20 * 1000);

                            let result = await context.ExecuteGenerator(
                                {
                                    TestGeneratorOptions: {
                                        FileMappings: [
                                            {
                                                Destination: "package.json",
                                                Processor: (target, generator) =>
                                                {
                                                    generator.fs.writeJSON(
                                                        target.Destination,
                                                        {
                                                            name: ""
                                                        });
                                                }
                                            }
                                        ]
                                    }
                                }).withOptions(
                                    {
                                        skipInstall: false
                                    });

                            result.assertFile("package-lock.json");
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.destinationRoot),
                () =>
                {
                    let workingDirectory: string;
                    let tempDir: TempDirectory;

                    suiteSetup(
                        () =>
                        {
                            workingDirectory = process.cwd();
                            tempDir = new TempDirectory();
                        });

                    suiteTeardown(
                        () =>
                        {
                            process.chdir(workingDirectory);
                            tempDir.Dispose();
                        });

                    test(
                        `Checking whether changing the \`${nameof<TestGenerator>((g) => g.destinationRoot)}\` changes the working directory of the environment…`,
                        () =>
                        {
                            generator.destinationRoot(tempDir.FullName);
                            AssertPath(generator.env.cwd, tempDir.FullName);
                            AssertPath(process.cwd(), tempDir.FullName);
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.modulePath),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<TestGenerator>((g) => g.modulePath)}\` resolves to the root of the generator's module…`,
                        () =>
                        {
                            AssertPath(generator.modulePath(testPath), join(moduleRoot, testPath));
                        });

                    test(
                        `Checking whether \`${nameof<TestGenerator>((g) => g.modulePath)}\` always is absolute…`,
                        () =>
                        {
                            let modulePath = generator.modulePath();
                            ok(isAbsolute(modulePath));
                            generator.moduleRoot("this is a test");
                            notStrictEqual(generator.modulePath(), modulePath);
                            ok(isAbsolute(generator.modulePath()));
                            generator.moduleRoot(modulePath);
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.templatePath),
                () =>
                {
                    let relativePath: string;

                    suiteSetup(
                        () =>
                        {
                            relativePath = relative(ProcessPath(moduleRoot), ProcessPath(generator.templatePath()));
                        });

                    test(
                        "Checking whether the template-path is a sub-directory of the module…",
                        () =>
                        {
                            ok(!isAbsolute(relativePath));
                            ok(!relativePath.startsWith(".."));
                        });

                    test(
                        `Checking whether \`${nameof<TestGenerator>((g) => g.TemplateRoot)}\` is optional…`,
                        () =>
                        {
                            options.TemplateRoot = null;
                            doesNotThrow(() => generator.templatePath());
                        });

                    test(
                        `Checking whether the template-path resolves to the specified \`${nameof<TestGenerator>((g) => g.TemplateRoot)}\`…`,
                        () =>
                        {
                            options.TemplateRoot = "Test";
                            AssertPath(generator.templatePath(testPath), join(moduleRoot, relativePath, options.TemplateRoot, testPath));
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.Components),
                () =>
                {
                    let generator: TestGenerator<ITestGeneratorSettings>;
                    let options: ITestOptions<ITestGeneratorSettings> = {};
                    let defaultID: string;
                    let hiddenID: string;
                    let defaultQuestionID: string;
                    let hiddenQuestionID: string;
                    let defaultValue: string;
                    let fileMappingExecuted: boolean;

                    suiteSetup(
                        async function()
                        {
                            this.timeout(2 * 1000);
                            defaultID = "default-component";
                            hiddenID = "non-default-component";
                            defaultQuestionID = "this-question-has-a-default-value";
                            hiddenQuestionID = "this-question-does-not-appear-in-the-results";
                            defaultValue = "This is the default value";
                            fileMappingExecuted = false;

                            options.Components = {
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
                                                DisplayName: "Shush - wanna have some of this, too?",
                                                DefaultEnabled: false,
                                                FileMappings: [],
                                                Questions: [
                                                    {
                                                        type: "input",
                                                        name: hiddenQuestionID,
                                                        message: "Answer me!",
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

                            let runContext = context.ExecuteGenerator({ TestGeneratorOptions: options });
                            await runContext.toPromise();
                            generator = runContext.generator;
                        });

                    test(
                        "Checking whether only default components are selected by default…",
                        () =>
                        {
                            strictEqual(generator.Settings[GeneratorSettingKey.Components].length, 1);
                            ok(generator.Settings[GeneratorSettingKey.Components].includes(defaultID));
                            ok(!generator.Settings[GeneratorSettingKey.Components].includes(hiddenID));
                        });

                    test(
                        "Checking whether additional questions are asked, only if components are selected…",
                        () =>
                        {
                            ok(defaultQuestionID in generator.Settings);
                            ok(!(hiddenQuestionID in generator.Settings));
                        });

                    test(
                        "Checking whether default values are applied…",
                        () =>
                        {
                            strictEqual(generator.Settings[defaultQuestionID], defaultValue);
                        });

                    test(
                        "Checking whether file-mappings are executed…",
                        () =>
                        {
                            ok(fileMappingExecuted);
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.Questions),
                () =>
                {
                    let generator: TestGenerator<ITestGeneratorSettings>;
                    let options: ITestOptions<ITestGeneratorSettings> = {};
                    let defaultID: string;
                    let hiddenID: string;
                    let defaultValue: string[];

                    suiteSetup(
                        async function()
                        {
                            this.timeout(2 * 1000);
                            defaultID = "this-is-a-default-question";
                            hiddenID = "this-is-a-hidden-question";
                            defaultValue = ["a"];

                            options.Questions = [
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

                            let runContext = context.ExecuteGenerator({ TestGeneratorOptions: options });
                            await runContext.toPromise();
                            generator = runContext.generator;
                        });

                    test(
                        "Checking whether only settings for enabled questions are present…",
                        () =>
                        {
                            ok(defaultID in generator.Settings);
                            ok(!(hiddenID in generator.Settings));
                        });

                    test(
                        "Checking whether default values are applied…",
                        () =>
                        {
                            strictEqual(generator.Settings[defaultID], defaultValue);
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.FileMappings),
                () =>
                {
                    let tempFile: TempFile;
                    let testFileName: string;
                    let testContent: string;

                    suiteSetup(
                        async () =>
                        {
                            tempFile = new TempFile();
                            testFileName = "test-filename";
                            testContent = "this is a test";
                            await writeFile(tempFile.FullName, testContent);

                            options.FileMappings = [
                                {
                                    Source: tempFile.FullName,
                                    Destination: testFileName
                                }
                            ];
                        });

                    suiteTeardown(
                        () =>
                        {
                            tempFile.Dispose();
                        });

                    test(
                        "Checking whether file-mappings can be added which are executed in any case…",
                        async function()
                        {
                            this.slow(1 * 1000);
                            this.timeout(2 * 1000);
                            let runContext = context.ExecuteGenerator({ TestGeneratorOptions: options });
                            await runContext.toPromise();
                            strictEqual((await readFile(runContext.generator.destinationPath(testFileName))).toString(), testContent);
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.ResolvedFileMappings),
                () =>
                {
                    suiteSetup(
                        () =>
                        {
                            options.FileMappings = [];

                            for (let i = context.Random.integer(0, 10); i >= 0; i--)
                            {
                                options.FileMappings.push(
                                    {
                                        Source: context.RandomString,
                                        Destination: context.RandomString
                                    });
                            }
                        });

                    test(
                        "Checking whether a resolved file-mapping is created for each file-mapping…",
                        async () =>
                        {
                            strictEqual(generator.ResolvedFileMappings.Items.length, generator.FileMappings.length);

                            ok(
                                generator.FileMappings.every(
                                    (fileMappingOptions) =>
                                    {
                                        return generator.ResolvedFileMappings.Items.some(
                                            (fileMapping) =>
                                            {
                                                return fileMapping.Object === fileMappingOptions;
                                            });
                                    }));
                        });
                });

            suite(
                nameof<TestGenerator>((generator) => generator.FileMappingCollection),
                () =>
                {
                    let enabledComponentDestination: string;
                    let disabledComponentDestination: string;
                    let fileMappingDestination: string;

                    setup(
                        () =>
                        {
                            enabledComponentDestination = context.RandomString + "1";
                            disabledComponentDestination = context.RandomString + "2";
                            fileMappingDestination = context.RandomString + "3";

                            options.FileMappings = [
                                {
                                    Destination: fileMappingDestination
                                }
                            ];

                            options.Components = {
                                Question: "",
                                Categories: [
                                    {
                                        DisplayName: "",
                                        Components: [
                                            {
                                                ID: enabledComponentDestination,
                                                DisplayName: "",
                                                FileMappings: [
                                                    {
                                                        Destination: enabledComponentDestination
                                                    }
                                                ]
                                            },
                                            {
                                                ID: disabledComponentDestination,
                                                DisplayName: "",
                                                FileMappings: [
                                                    {
                                                        Destination: disabledComponentDestination
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            };

                            generator.Settings[GeneratorSettingKey.Components] = [enabledComponentDestination];
                        });

                    test(
                        "Checking whether default file-mappings are present…",
                        async () =>
                        {
                            strictEqual(
                                generator.FileMappingCollection.Items.filter(
                                    (fileMapping) => fileMapping.Object.Destination === fileMappingDestination).length,
                                1);
                        });

                    test(
                        "Checking whether file-mappings of enabled components are present…",
                        async () =>
                        {
                            strictEqual(
                                generator.FileMappingCollection.Items.filter(
                                    (fileMapping) => fileMapping.Object.Destination === enabledComponentDestination).length,
                                1);
                        });

                    test(
                        "Checking whether file-mappings of disabled components are not present…",
                        async () =>
                        {
                            ok(
                                !generator.FileMappingCollection.Items.some(
                                    (fileMapping) => fileMapping.Object.Destination === disabledComponentDestination));
                        });
                });
        });
}
