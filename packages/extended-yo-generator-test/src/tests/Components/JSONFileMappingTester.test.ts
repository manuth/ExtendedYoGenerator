import Assert = require("assert");
import { IFileMapping } from "@manuth/extended-yo-generator";
import { TempFile } from "temp-filesystem";
import { JSONFileMappingTester } from "../../Components/JSONFileMappingTester";
import { TestContext } from "../../TestContext";
import TestGenerator = require("../../generators/app");

/**
 * Registers tests for the `JSONFileMappingTester` class.
 *
 * @param context
 * The test-context.
 */
export function JSONFileMappingTesterTests(context: TestContext<TestGenerator>): void
{
    suite(
        "JSONFileMappingTester",
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
                    this.timeout(0);
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
                "Metadata",
                () =>
                {
                    test(
                        "Checking whether the metadata is read from the json-file correctly…",
                        async () =>
                        {
                            await tester.Run();
                            Assert.deepStrictEqual(await tester.Metadata, randomObject);
                        });
                });
        });
}
