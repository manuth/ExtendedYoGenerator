import { doesNotReject, ok, rejects, strictEqual } from "assert";
import { IFileMapping } from "@manuth/extended-yo-generator";
import { TempFile, TempFileSystem } from "@manuth/temp-files";
import fs from "fs-extra";
import { FileMappingTester } from "../../Components/FileMappingTester.js";
import { TestContext } from "../../TestContext.js";
import { TestGenerator } from "../../TestGenerator.js";

const { pathExists, readFile, writeFile } = fs;

/**
 * Registers tests for the {@link FileMappingTester `FileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTesterTests(context: TestContext<TestGenerator>): void
{
    suite(
        nameof(FileMappingTester),
        () =>
        {
            let tempFile: TempFile;
            let sourceFile: TempFile;
            let destinationFile: string;
            let fileMapping: IFileMapping<any, any>;
            let tester: FileMappingTester<TestGenerator, any, any, IFileMapping<any, any>>;
            let content: string;
            let randomValue: string;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    tempFile = new TempFile();
                    sourceFile = new TempFile();
                    destinationFile = TempFileSystem.TempName();

                    fileMapping = {
                        Source: sourceFile.FullName,
                        Destination: destinationFile
                    };

                    content = "this is a test";
                    tester = new FileMappingTester(await context.Generator, fileMapping);
                });

            suiteTeardown(
                async () =>
                {
                    tempFile.Dispose();
                    sourceFile.Dispose();
                    await tester.Clean();
                });

            setup(
                async () =>
                {
                    randomValue = context.RandomString;
                    return tester.WriteSource(content);
                });

            teardown(
                async () =>
                {
                    return tester.Clean();
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.Exists),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<FileMappingTester<any, any, any, any>>((t) => t.Exists)}\` equals to the existence of the destination-file…`,
                        async () =>
                        {
                            ok(!await tester.Exists);
                            await tester.Run();
                            ok(await tester.Exists);
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.ReadFile),
                () =>
                {
                    test(
                        "Checking whether files are read correctly…",
                        async () =>
                        {
                            await writeFile(tempFile.FullName, randomValue);
                            strictEqual(await tester.ReadFile(tempFile.FullName), randomValue);
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.ReadSource),
                () =>
                {
                    test(
                        "Checking whether the source-file is read correctly…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await writeFile(sourceFile.FullName, randomValue);
                            strictEqual(await tester.ReadSource(), randomValue);
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.ReadOutput),
                () =>
                {
                    test(
                        "Checking whether the output-file is read correctly…",
                        async () =>
                        {
                            await tester.Run();
                            strictEqual(await tester.ReadOutput(), content);
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.Run),
                () =>
                {
                    test(
                        "Checking whether the tester can be executed…",
                        async () =>
                        {
                            return doesNotReject(() => tester.Run());
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.WriteFile),
                () =>
                {
                    test(
                        "Checking whether contents are written to both the file-system and mem-fs…",
                        async () =>
                        {
                            ok(!await tester.Exists);
                            await tester.WriteFile(tester.FileMapping.Destination, content);
                            strictEqual(tester.Generator.fs.read(tester.FileMapping.Destination), content);
                            strictEqual((await readFile(tester.FileMapping.Destination)).toString(), content);
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.WriteSource),
                () =>
                {
                    test(
                        "Checking whether contents can be written to the source-file…",
                        async () =>
                        {
                            await tester.WriteSource(randomValue);
                            strictEqual((await readFile(tester.FileMapping.Source)).toString(), randomValue);
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.WriteOutput),
                () =>
                {
                    test(
                        "Checking whether contents can be written to the destination-file…",
                        async () =>
                        {
                            await tester.WriteOutput(randomValue);
                            strictEqual((await readFile(tester.FileMapping.Destination)).toString(), randomValue);
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.Commit),
                () =>
                {
                    test(
                        "Checking whether changes made to the mem-fs can be committed…",
                        async () =>
                        {
                            tester.Generator.fs.write(tester.FileMapping.Destination, randomValue);
                            ok(!await tester.Exists);
                            await tester.Commit();
                            ok(await tester.Exists);
                            strictEqual((await readFile(tester.FileMapping.Destination)).toString(), randomValue);
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.AssertContent),
                () =>
                {
                    test(
                        "Checking whether the content of the destination-file can be asserted correctly…",
                        async () =>
                        {
                            await tester.Run();
                            await rejects(() => tester.AssertContent(content + "test"));
                            return doesNotReject(() => tester.AssertContent(content));
                        });
                });

            suite(
                nameof<FileMappingTester<any, any, any, any>>((tester) => tester.Clean),
                () =>
                {
                    test(
                        "Checking whether the file is deleted from both the file-system and the mem-fs…",
                        async () =>
                        {
                            await tester.Run();
                            ok(tester.Generator.fs.exists(tester.FileMapping.Destination));
                            ok(await pathExists(tester.FileMapping.Destination));
                            await tester.Clean();
                            ok(!tester.Generator.fs.exists(tester.FileMapping.Destination));
                            ok(!await pathExists(tester.FileMapping.Destination));
                        });
                });
        });
}
