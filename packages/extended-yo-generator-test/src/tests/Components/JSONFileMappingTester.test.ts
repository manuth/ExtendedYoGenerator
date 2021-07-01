import { deepStrictEqual } from "assert";
import { IFileMapping } from "@manuth/extended-yo-generator";
import { TempFile } from "@manuth/temp-files";
import { JSONFileMappingTester } from "../../Components/JSONFileMappingTester";
import TestGenerator = require("../../generators/app");
import { TestContext } from "../../TestContext";

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
                    randomObject = context.RandomObject;
                    await tester.WriteSource(JSON.stringify(randomObject));
                });

            suite(
                nameof<JSONFileMappingTester<any, any, any, any>>((tester) => tester.Metadata),
                () =>
                {
                    test(
                        "Checking whether the metadata is read from the json-file correctly…",
                        async () =>
                        {
                            await tester.Run();
                            deepStrictEqual(await tester.Metadata, randomObject);
                        });
                });
        });
}
