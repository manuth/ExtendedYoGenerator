import { strictEqual } from "assert";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { writeFile } from "fs-extra";
import { GeneratorOptions } from "yeoman-generator";
import { FileMappingOptions } from "../../../Components/FileManagement/FileMappingOptions";

/**
 * Registers tests for the {@link FileMappingOptions `FileMappingOptions<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingOptionsTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(FileMappingOptions),
        () =>
        {
            /**
             * Provides an implementation of the {@link FileMappingOptions `FileMappingOptions<TSettings, TOptions>`} class for testing.
             */
            class MyFileMapping extends FileMappingOptions<ITestGeneratorSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 */
                public constructor()
                {
                    super(generator);
                }

                /**
                 * @inheritdoc
                 */
                public override get Source(): string
                {
                    return tempSourceFile.FullName;
                }

                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return tempDestinationFile.FullName;
                }

                /**
                 * @inheritdoc
                 */
                public override async Processor(): Promise<void>
                {
                    return this.WriteDestination(await this.Content);
                }

                /**
                 * @inheritdoc
                 *
                 * @param path
                 * The path to the file to read.
                 *
                 * @returns
                 * The contents of the file.
                 */
                public override async ReadFile(path: string): Promise<string>
                {
                    return super.ReadFile(path);
                }
            }

            let generator: TestGenerator;
            let tempFile: TempFile;
            let tempSourceFile: TempFile;
            let tempDestinationFile: TempFile;
            let fileMappingOptions: MyFileMapping;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, FileMappingOptions<ITestGeneratorSettings, GeneratorOptions>>;
            let randomValue: string;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    tempFile = new TempFile();
                    tempSourceFile = new TempFile();
                    tempDestinationFile = new TempFile();
                    fileMappingOptions = new MyFileMapping();
                    tester = new FileMappingTester(generator, fileMappingOptions);
                });

            suiteTeardown(
                () =>
                {
                    tempFile.Dispose();
                    tempSourceFile.Dispose();
                    tempDestinationFile.Dispose();
                });

            setup(
                () =>
                {
                    randomValue = context.RandomString;
                });

            teardown(
                async () =>
                {
                    await tester.Commit();
                });

            suite(
                nameof<FileMappingOptions<any, any>>((options) => options.Content),
                () =>
                {
                    test(
                        "Checking whether the content is read from the source-file…",
                        async () =>
                        {
                            await writeFile(tempSourceFile.FullName, randomValue);
                            strictEqual(await fileMappingOptions.Content, randomValue);
                        });
                });

            suite(
                nameof<FileMappingOptions<any, any>>((options) => options.Processor),
                () =>
                {
                    test(
                        "Checking whether the content is written to the `mem-fs` correctly…",
                        async () =>
                        {
                            await writeFile(tempSourceFile.FullName, randomValue);
                            await fileMappingOptions.Processor();
                            strictEqual(generator.fs.read(tempDestinationFile.FullName), randomValue);
                        });
                });

            suite(
                nameof<MyFileMapping>((options) => options.ReadFile),
                () =>
                {
                    test(
                        "Checking whether files can be read from the file-system…",
                        async () =>
                        {
                            await writeFile(tempFile.FullName, randomValue);
                            strictEqual(await fileMappingOptions.ReadFile(tempFile.FullName), randomValue);
                        });
                });
        });
}
