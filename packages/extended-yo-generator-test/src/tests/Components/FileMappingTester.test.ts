import { doesNotReject, ok, rejects, strictEqual } from "assert";
import { IFileMapping } from "@manuth/extended-yo-generator";
import { TempFile } from "@manuth/temp-files";
import { pathExists, readFile } from "fs-extra";
import { FileMappingTester } from "../../Components/FileMappingTester";
import { TestContext } from "../../TestContext";
import { TestGenerator } from "../../TestGenerator";

/**
 * Registers tests for the `FileMappingTester` class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTesterTests(context: TestContext<TestGenerator>): void
{
    suite(
        "FileMappingTester",
        () =>
        {
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMapping: IFileMapping<any, any>;
            let tester: FileMappingTester<TestGenerator, any, any, IFileMapping<any, any>>;
            let content: string;
            let randomValue: string;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();

                    fileMapping = {
                        Source: sourceFile.FullName,
                        Destination: destinationFile.FullName
                    };

                    destinationFile.Dispose();
                    content = "this is a test";
                    tester = new FileMappingTester(await context.Generator, fileMapping);
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
                "Exists",
                () =>
                {
                    test(
                        "Checking whether `Exists` equals to the existence of the destination-file…",
                        async () =>
                        {
                            ok(!await tester.Exists);
                            await tester.Run();
                            ok(await tester.Exists);
                        });
                });

            suite(
                "Content",
                () =>
                {
                    test(
                        "Checking whether the content is read from the destination-file…",
                        async () =>
                        {
                            await tester.Run();
                            strictEqual(await tester.Content, content);
                        });
                });

            suite(
                "Run",
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
                "WriteFile",
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
                "WriteSource",
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
                "WriteDestination",
                () =>
                {
                    test(
                        "Checking whether contents can be written to the destination-file…",
                        async () =>
                        {
                            await tester.WriteDestination(randomValue);
                            strictEqual((await readFile(tester.FileMapping.Destination)).toString(), randomValue);
                        });
                });

            suite(
                "Commit",
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
                "AssertContent",
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
                "Clean",
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
