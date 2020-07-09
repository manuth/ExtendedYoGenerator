import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { render } from "ejs";
import { writeFile, readFile } from "fs-extra";
import { TempDirectory, TempFile } from "temp-filesystem";
import { FileMapping } from "../../Components/FileMapping";
import { IFileMapping } from "../../Components/IFileMapping";
import { ITestOptions } from "../Generator/ITestOptions";
import { TestGenerator } from "../Generator/TestGenerator/TestGenerator";

/**
 * Provides tests for the `FileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TestGenerator, ITestOptions>): void
{
    suite(
        "FileMapping",
        () =>
        {
            let generator: TestGenerator;
            let fileMapping: FileMapping<any>;
            let testPath = "test.txt";
            let testDirectory: TempDirectory;

            let fileMappingOptions: IFileMapping<any> = {
                Source: null,
                Destination: null,
                Context: null,
                Processor: null
            };

            suiteSetup(
                async () =>
                {
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
                "Promise<string> Source",
                () =>
                {
                    test(
                        "Checking whether relative paths are resolved to the template-directory…",
                        async () =>
                        {
                            fileMappingOptions.Source = testPath;
                            Assert.strictEqual(await fileMapping.Source, generator.templatePath(testPath));
                        });

                    test(
                        "Checking whether absolute paths are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Source = testDirectory.MakePath(testPath);
                            Assert.strictEqual(await fileMapping.Source, testDirectory.MakePath(testPath));
                        });

                    test(
                        "Checking whether `null`-values are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Source = null;
                            Assert.strictEqual(await fileMapping.Source, null);
                        });
                });

            suite(
                "Promise<string> Destination",
                async () =>
                {
                    test(
                        "Checking whether relative paths are resolved to the destination-directory…",
                        async () =>
                        {
                            fileMappingOptions.Destination = testPath;
                            Assert.strictEqual(await fileMapping.Destination, generator.destinationPath(testPath));
                        });

                    test(
                        "Checking whether absolute paths are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Destination = testDirectory.MakePath(testPath);
                            Assert.strictEqual(await fileMapping.Destination, testDirectory.MakePath(testPath));
                        });

                    test(
                        "Checking whether `null`-values are preserved…",
                        async () =>
                        {
                            fileMappingOptions.Destination = null;
                            Assert.strictEqual(await fileMapping.Destination, null);
                        });
                });

            suite(
                "Function Processor",
                async () =>
                {
                    suite(
                        "Testing cases when `Processor` is defined…",
                        () =>
                        {
                            test(
                                "Checking whether processors are resolved, if defined…",
                                () =>
                                {
                                    /**
                                     * Processes a file-mapping.
                                     */
                                    let processor = async (): Promise<void> => { };

                                    fileMappingOptions.Processor = processor;
                                    Assert.strictEqual(fileMapping.Processor, processor);
                                    fileMappingOptions.Processor = null;
                                    Assert.notStrictEqual(fileMapping.Processor, null);
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
                                async () =>
                                {
                                    await fileMapping.Processor(fileMapping, generator);
                                    return AssertDestinationContent(testContent);
                                });

                            test(
                                "Checking whether files are copied using `ejs` if `Context` is defined…",
                                async () =>
                                {
                                    fileMappingOptions.Context = () => testContext;
                                    await fileMapping.Processor(fileMapping, generator);
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
                                            await fileMapping.Processor(fileMapping, generator);
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
                                            await fileMapping.Processor(fileMapping, generator);
                                        })());
                                });
                        });
                });
        });
}
