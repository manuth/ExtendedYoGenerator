import { doesNotReject, notStrictEqual, rejects, strictEqual } from "assert";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempDirectory, TempFile } from "@manuth/temp-files";
import { render } from "ejs";
import { readFile, writeFile } from "fs-extra";
import { FileMapping } from "../../../Components/FileManagement/FileMapping";
import { IFileMapping } from "../../../Components/FileManagement/IFileMapping";

/**
 * Provides tests for the {@link FileMapping `FileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(FileMapping),
        () =>
        {
            let generator: TestGenerator;
            let fileMapping: FileMapping<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>>;
            let testPath = "test.txt";
            let testDirectory: TempDirectory;

            let fileMappingOptions: IFileMapping<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>> = {
                Source: null,
                Destination: null,
                Context: null,
                Processor: null
            };

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    fileMapping = new FileMapping(generator, fileMappingOptions);
                    testDirectory = new TempDirectory();
                });

            suiteTeardown(
                () =>
                {
                    testDirectory.Dispose();
                });

            setup(
                () =>
                {
                    fileMappingOptions.Source = null;
                    fileMappingOptions.Destination = null;
                    fileMappingOptions.Context = null;
                    fileMappingOptions.Processor = null;
                });

            suite(
                nameof<FileMapping<any, any>>((fileMapping) => fileMapping.ID),
                () =>
                {
                    test(
                        "Checking whether the value can be set…",
                        () =>
                        {
                            let value = context.RandomString;
                            fileMapping.ID = value;
                            strictEqual(fileMappingOptions.ID, value);
                        });
                });

            suite(
                nameof<FileMapping<any, any>>((fileMapping) => fileMapping.Source),
                () =>
                {
                    test(
                        "Checking whether relative paths are resolved to the template-directory…",
                        async () =>
                        {
                            fileMappingOptions.Source = testPath;
                            strictEqual(fileMapping.Source, generator.templatePath(testPath));
                        });

                    test(
                        "Checking whether absolute paths are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Source = testDirectory.MakePath(testPath);
                            strictEqual(fileMapping.Source, testDirectory.MakePath(testPath));
                        });

                    test(
                        `Checking whether \`${null}\`-values are preserved…`,
                        async () =>
                        {
                            fileMappingOptions.Source = null;
                            strictEqual(fileMapping.Source, null);
                        });

                    test(
                        "Checking whether the value can be set…",
                        () =>
                        {
                            let value = context.RandomString;
                            fileMapping.Source = value;
                            strictEqual(fileMappingOptions.Source, value);
                        });
                });

            suite(
                nameof<IFileMapping<any, any>>((fileMapping) => fileMapping.Destination),
                async () =>
                {
                    test(
                        "Checking whether relative paths are resolved to the destination-directory…",
                        async () =>
                        {
                            fileMappingOptions.Destination = testPath;
                            strictEqual(fileMapping.Destination, generator.destinationPath(testPath));
                        });

                    test(
                        "Checking whether absolute paths are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Destination = testDirectory.MakePath(testPath);
                            strictEqual(fileMapping.Destination, testDirectory.MakePath(testPath));
                        });

                    test(
                        `Checking whether \`${null}\`-values are preserved…`,
                        async () =>
                        {
                            fileMappingOptions.Destination = null;
                            strictEqual(fileMapping.Destination, null);
                        });

                    test(
                        "Checking whether the value can be set…",
                        () =>
                        {
                            let value = context.RandomString;
                            fileMapping.Destination = value;
                            strictEqual(fileMappingOptions.Destination, value);
                        });
                });

            suite(
                nameof<FileMapping<any, any>>((fileMapping) => fileMapping.Context),
                () =>
                {
                    test(
                        "Checking whether the value can be set…",
                        () =>
                        {
                            let value = (): any => context.RandomObject;
                            fileMapping.Context = value;
                            strictEqual(fileMappingOptions.Context, value);
                        });
                });

            suite(
                nameof<FileMapping<any, any>>((fileMapping) => fileMapping.Processor),
                async () =>
                {
                    suite(
                        "General",
                        () =>
                        {
                            test(
                                "Checking whether the value can be set…",
                                () =>
                                {
                                    let value = (): void => { };
                                    fileMapping.Processor = value;
                                    strictEqual(fileMappingOptions.Processor, value);
                                });
                        });

                    suite(
                        `Testing cases when \`${nameof<FileMapping<any, any>>((f) => f.Processor)}\` is defined…`,
                        () =>
                        {
                            test(
                                "Checking whether processors are resolved, if defined…",
                                async () =>
                                {
                                    let testValue: string;
                                    let randomValue = context.RandomString;

                                    /**
                                     * Processes a file-mapping.
                                     */
                                    let processor = async (): Promise<void> =>
                                    {
                                        testValue = randomValue;
                                    };

                                    fileMappingOptions.Processor = processor;
                                    await doesNotReject(async () => fileMapping.Processor());
                                    strictEqual(testValue, randomValue);
                                    fileMappingOptions.Processor = null;
                                    notStrictEqual(fileMapping.Processor, null);
                                });

                            test(
                                "Checking whether processors preserve the `thisArg` correctly…",
                                async () =>
                                {
                                    let testValue;

                                    let fileMappingOptions = new
                                        /**
                                         * Provides a test-implementation of the {@link IFileMapping `IFileMapping<TSettings, TOptions>`} interface.
                                         */
                                        class FileMappingOptions implements IFileMapping<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>>
                                        {
                                            /**
                                             * @inheritdoc
                                             */
                                            public Source = context.RandomString;

                                            /**
                                             * Gets a custom property-value.
                                             */
                                            public MyCustomProperty = context.RandomString;

                                            /**
                                             * @inheritdoc
                                             */
                                            public Destination = context.RandomString;

                                            /**
                                             * @inheritdoc
                                             */
                                            public async Processor(): Promise<void>
                                            {
                                                testValue = this.MyCustomProperty;
                                            }
                                        }();

                                    let fileMapping = new FileMapping(await context.Generator, fileMappingOptions);
                                    await doesNotReject(async () => fileMapping.Processor());
                                    strictEqual(testValue, fileMappingOptions.MyCustomProperty);
                                });
                        });

                    suite(
                        `Testing cases when \`${nameof<FileMapping<any, any>>((f) => f.Processor)}\` is undefined…`,
                        () =>
                        {
                            let testContent = "This is a <%= test %>.";
                            let testContext = { test: "this is a test" };
                            let sourceFile: TempFile;
                            let destinationFile: TempFile;

                            suiteSetup(
                                async () =>
                                {
                                    sourceFile = new TempFile();
                                    destinationFile = new TempFile();
                                    await writeFile(sourceFile.FullName, testContent);
                                });

                            suiteTeardown(
                                () =>
                                {
                                    sourceFile.Dispose();
                                    destinationFile.Dispose();
                                });

                            setup(
                                () =>
                                {
                                    fileMappingOptions.Source = sourceFile.FullName;
                                    fileMappingOptions.Destination = destinationFile.FullName;
                                });

                            /**
                             * Asserts the content of the destination-file.
                             *
                             * @param content
                             * The asserted content of the destination-file.
                             */
                            async function AssertOutputContent(content: string): Promise<void>
                            {
                                return new Promise(
                                    (resolve, reject) =>
                                    {
                                        generator.fs.commit(
                                            async (error) =>
                                            {
                                                if (error)
                                                {
                                                    reject(error);
                                                }
                                                else
                                                {
                                                    strictEqual((await readFile(destinationFile.FullName)).toString(), content);
                                                    resolve();
                                                }
                                            });
                                    });
                            }

                            test(
                                `Checking whether files are copied by default if \`${nameof<FileMapping<any, any>>((f) => f.Context)}\` is not defined…`,
                                async function()
                                {
                                    this.timeout(4 * 1000);
                                    this.slow(2 * 1000);
                                    await fileMapping.Processor();
                                    return AssertOutputContent(testContent);
                                });

                            test(
                                `Checking whether files are copied using \`ejs\` if \`${nameof<FileMapping<any, any>>((f) => f.Context)}\` is defined…`,
                                async function()
                                {
                                    this.timeout(4 * 1000);
                                    this.slow(2 * 1000);
                                    fileMappingOptions.Context = () => testContext;
                                    await fileMapping.Processor();
                                    return AssertOutputContent(render(testContent, testContext));
                                });

                            test(
                                `Checking whether leaving \`${nameof<FileMapping<any, any>>((f) => f.Source)}\` undefined causes an error…`,
                                async () =>
                                {
                                    fileMappingOptions.Source = null;

                                    rejects(
                                        (async () =>
                                        {
                                            await fileMapping.Processor();
                                        })());
                                });

                            test(
                                `Checking whether leaving \`${nameof<FileMapping<any, any>>((f) => f.Destination)}\` undefined causes an error…`,
                                async () =>
                                {
                                    fileMappingOptions.Destination = null;

                                    rejects(
                                        (async () =>
                                        {
                                            await fileMapping.Processor();
                                        })());
                                });
                        });
                });

            suite(
                nameof<FileMapping<any, any>>((fileMapping) => fileMapping.Result),
                () =>
                {
                    let tempDir: TempDirectory;

                    suiteSetup(
                        () =>
                        {
                            tempDir = new TempDirectory();
                        });

                    suiteSetup(
                        () =>
                        {
                            tempDir.Dispose();
                        });

                    test(
                        "Checking whether the destination- and source-path are resolved using the proper generator…",
                        () =>
                        {
                            let customGenerator = context.CreateGenerator(
                                class extends TestGenerator<any, any>
                                {
                                    /**
                                     * @inheritdoc
                                     *
                                     * @param path The path parts.
                                     *
                                     * @returns
                                     * The joined path.
                                     */
                                    public override templatePath(...path: string[]): string
                                    {
                                        return tempDir.MakePath(...path);
                                    }
                                });

                            fileMappingOptions.Source = context.RandomString;
                            strictEqual(new FileMapping(customGenerator, fileMappingOptions).Source, customGenerator.templatePath(fileMappingOptions.Source));
                            strictEqual(new FileMapping(customGenerator, fileMapping.Result).Source, generator.templatePath(fileMappingOptions.Source));
                            notStrictEqual(new FileMapping(customGenerator, fileMapping.Result).Source, customGenerator.templatePath(fileMappingOptions.Source));
                        });
                });
        });
}
