import { deepStrictEqual } from "node:assert";
import { IFileMapping } from "@manuth/extended-yo-generator";
import { TempFile } from "@manuth/temp-files";
import { JSONFileMappingTester } from "../../Components/JSONFileMappingTester.js";
import { TestContext } from "../../TestContext.js";
import { TestGenerator } from "../../TestGenerator.js";

/**
 * Registers tests for the {@link JSONFileMappingTester `JSONFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
 *
 * @param context
 * The test-context.
 */
export function JSONFileMappingTesterTests(context: TestContext<TestGenerator>): void
{
    suite(
        nameof(JSONFileMappingTester),
        () =>
        {
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMapping: IFileMapping<any, any>;
            let tester: JSONFileMappingTester<TestGenerator, any, any, IFileMapping<any, any>>;
            let metadata: any;
            let randomObject: any;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();

                    fileMapping = {
                        Source: sourceFile.FullName,
                        Destination: destinationFile.FullName
                    };

                    destinationFile.Dispose();
                    tester = new JSONFileMappingTester(await context.Generator, fileMapping);
                    metadata = context.RandomObject;
                    await tester.WriteSource(JSON.stringify(metadata));
                });

            setup(
                () =>
                {
                    randomObject = context.RandomObject;
                });

            suite(
                nameof<JSONFileMappingTester<any, any, any, any>>((tester) => tester.Parse),
                () =>
                {
                    test(
                        "Checking whether the metadata is read from the json-file correctly…",
                        async () =>
                        {
                            await tester.Run();
                            deepStrictEqual(await tester.Parse(await tester.ReadSource()), metadata);
                            deepStrictEqual(await tester.Parse(await tester.ReadOutput()), metadata);
                        });
                });

            suite(
                nameof<JSONFileMappingTester<any, any, any, any>>((tester) => tester.ParseSource),
                () =>
                {
                    test(
                        "Checking whether the source-file is parsed correctly…",
                        async () =>
                        {
                            await tester.WriteSource(JSON.stringify(randomObject));
                            deepStrictEqual(await tester.ParseSource(), randomObject);
                        });
                });

            suite(
                nameof<JSONFileMappingTester<any, any, any, any>>((tester) => tester.ParseOutput),
                () =>
                {
                    test(
                        "Checking whether the output-file is parsed correctly…",
                        async () =>
                        {
                            await tester.WriteOutput(JSON.stringify(randomObject));
                            deepStrictEqual(await tester.ParseOutput(), randomObject);
                        });
                });
        });
}
