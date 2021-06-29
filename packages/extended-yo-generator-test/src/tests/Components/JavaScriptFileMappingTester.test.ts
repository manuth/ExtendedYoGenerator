import { deepStrictEqual, notDeepStrictEqual, notStrictEqual, strictEqual } from "assert";
import { IFileMapping } from "@manuth/extended-yo-generator";
import { TempFile } from "@manuth/temp-files";
import { JavaScriptFileMappingTester } from "../../Components/JavaScriptFileMappingTester";
import TestGenerator = require("../../generators/app");
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link JavaScriptFileMappingTester `JavaScriptFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
 *
 * @param context
 * The test-context.
 */
export function JavaScriptFileMappingTesterTests(context: TestContext<TestGenerator>): void
{
    suite(
        nameof(JavaScriptFileMappingTester),
        () =>
        {
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMapping: IFileMapping<any, any>;
            let tester: JavaScriptFileMappingTester<TestGenerator, any, any, IFileMapping<any, any>>;
            let randomObject: any;
            let randomString: string;

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
                    tester = new JavaScriptFileMappingTester(await context.Generator, fileMapping);
                });

            setup(
                async () =>
                {
                    randomString = context.RandomString;
                    randomObject = context.RandomObject;
                    return tester.WriteSource(`module.exports = JSON.parse(${JSON.stringify(JSON.stringify(randomObject))});`);
                });

            suite(
                nameof<JavaScriptFileMappingTester<any, any, any, any>>((tester) => tester.Require),
                () =>
                {
                    test(
                        "Checking whether the value is required from the destination-file…",
                        async () =>
                        {
                            await tester.Run();
                            deepStrictEqual(await tester.Require(), randomObject);
                        });

                    test(
                        "Checking whether the value can be hot-reloaded…",
                        async () =>
                        {
                            await tester.Run();
                            deepStrictEqual(await tester.Require(), randomObject);
                            deepStrictEqual(await tester.Require(), await tester.Require());
                            notStrictEqual(await tester.Require(), await tester.Require());
                            await tester.WriteSource(`module.exports = ${JSON.stringify(randomString)};`);
                            await tester.Run();
                            notStrictEqual(await tester.Require(), randomObject);
                            notDeepStrictEqual(await tester.Require(), randomObject);
                            strictEqual(await tester.Require(), randomString);
                        });
                });
        });
}
