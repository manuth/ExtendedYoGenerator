import Assert = require("assert");
import { TestContext, TestGenerator, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions } from "@manuth/extended-yo-generator-test";
import { render } from "ejs";
import { writeFile, readFile } from "fs-extra";
import { Random } from "random-js";
import { TempDirectory, TempFile } from "temp-filesystem";
import { FileMapping } from "../../Components/FileMapping";
import { IFileMapping } from "../../Components/IFileMapping";

/**
 * Provides tests for the `FileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "FileMapping",
        () =>
        {
            let random: Random;
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
                async () =>
                {
                    random = new Random();
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
                "Source",
                () =>
                {
                    test(
                        "Checking whether relative paths are resolved to the template-directory…",
                        async () =>
                        {
                            fileMappingOptions.Source = testPath;
                            Assert.strictEqual(fileMapping.Source, generator.templatePath(testPath));
                        });

                    test(
                        "Checking whether absolute paths are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Source = testDirectory.MakePath(testPath);
                            Assert.strictEqual(fileMapping.Source, testDirectory.MakePath(testPath));
                        });

                    test(
                        "Checking whether `null`-values are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Source = null;
                            Assert.strictEqual(fileMapping.Source, null);
                        });
                });

            suite(
                "Destination",
                async () =>
                {
                    test(
                        "Checking whether relative paths are resolved to the destination-directory…",
                        async () =>
                        {
                            fileMappingOptions.Destination = testPath;
                            Assert.strictEqual(fileMapping.Destination, generator.destinationPath(testPath));
                        });

                    test(
                        "Checking whether absolute paths are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Destination = testDirectory.MakePath(testPath);
                            Assert.strictEqual(fileMapping.Destination, testDirectory.MakePath(testPath));
                        });

                    test(
                        "Checking whether `null`-values are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Destination = null;
                            Assert.strictEqual(fileMapping.Destination, null);
                        });
                });

            suite(
                "Processor",
                async () =>
                {
                    suite(
                        "Testing cases when `Processor` is defined…",
                        () =>
                        {
                            test(
                                "Checking whether processors are resolved, if defined…",
                                async () =>
                                {
                                    let testValue: string;
                                    let randomValue = random.string(10);

                                    /**
                                     * Processes a file-mapping.
                                     */
                                    let processor = async (): Promise<void> =>
                                    {
                                        testValue = randomValue;
                                    };

                                    fileMappingOptions.Processor = processor;
                                    await Assert.doesNotReject(async () => fileMapping.Processor());
                                    Assert.strictEqual(testValue, randomValue);
                                    fileMappingOptions.Processor = null;
                                    Assert.notStrictEqual(fileMapping.Processor, null);
                                });

                            test(
                                "Checking whether processors preserve the `thisArg` correctly…",
                                async () =>
                                {
                                    let testValue;

                                    let fileMappingOptions = new
                                        /**
                                         * Provides a test-implementation of the `IFileMapping<T>` interface.
                                         */
                                        class FileMappingOptions implements IFileMapping<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>>
                                        {
                                            /**
                                             * @inheritdoc
                                             */
                                            public Source = random.string(10);

                                            /**
                                             * Gets a custom property-value.
                                             */
                                            public MyCustomProperty = random.string(20);

                                            /**
                                             * @inheritdoc
                                             */
                                            public Destination = random.string(10);

                                            /**
                                             * @inheritdoc
                                             */
                                            public async Processor(): Promise<void>
                                            {
                                                testValue = this.MyCustomProperty;
                                            }
                                        }();

                                    let fileMapping = new FileMapping(await context.Generator, fileMappingOptions);
                                    await Assert.doesNotReject(async () => fileMapping.Processor());
                                    Assert.strictEqual(testValue, fileMappingOptions.MyCustomProperty);
                                });
                        });

                    suite(
                        "Testing cases when `Processor` is undefined…",
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
                            async function AssertDestinationContent(content: string): Promise<void>
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
                                                    Assert.strictEqual((await readFile(destinationFile.FullName)).toString(), content);
                                                    resolve();
                                                }
                                            });
                                    });
                            }

                            test(
                                "Checking whether files are copied by default if `Context` is not defined…",
                                async function()
                                {
                                    this.timeout(0);
                                    await fileMapping.Processor();
                                    return AssertDestinationContent(testContent);
                                });

                            test(
                                "Checking whether files are copied using `ejs` if `Context` is defined…",
                                async function()
                                {
                                    this.timeout(0);
                                    fileMappingOptions.Context = () => testContext;
                                    await fileMapping.Processor();
                                    return AssertDestinationContent(render(testContent, testContext));
                                });

                            test(
                                "Checking whether leaving `Source` undefined causes an error…",
                                async () =>
                                {
                                    fileMappingOptions.Source = null;

                                    Assert.rejects(
                                        (async () =>
                                        {
                                            await fileMapping.Processor();
                                        })());
                                });

                            test(
                                "Checking whether leaving `Destination` undefined causes an error…",
                                async () =>
                                {
                                    fileMappingOptions.Destination = null;

                                    Assert.rejects(
                                        (async () =>
                                        {
                                            await fileMapping.Processor();
                                        })());
                                });
                        });
                });
        });
}
