import Assert = require("assert");
import { IFileMapping } from "@manuth/extended-yo-generator";
import { TempFile } from "@manuth/temp-files";
import { JavaScriptFileMappingTester } from "../../Components/JavaScriptFileMappingTester";
import { TestContext } from "../../TestContext";
import TestGenerator = require("../../generators/app");

/**
 * Registers tests for the `JavaScriptFileMappingTester` class.
 *
 * @param context
 * The test-context.
 */
export function JavaScriptFileMappingTesterTests(context: TestContext<TestGenerator>): void
{
    suite(
        "JavaScriptFileMappingTester",
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
                "Require",
                () =>
                {
                    test(
                        "Checking whether the value is required from the destination-file…",
                        async () =>
                        {
                            await tester.Run();
                            Assert.deepStrictEqual(await tester.Require(), randomObject);
                        });

                    test(
                        "Checking whether the value can be hot-reloaded…",
                        async () =>
                        {
                            await tester.Run();
                            Assert.deepStrictEqual(await tester.Require(), randomObject);
                            Assert.deepStrictEqual(await tester.Require(), await tester.Require());
                            Assert.notStrictEqual(await tester.Require(), await tester.Require());
                            await tester.WriteSource(`module.exports = ${JSON.stringify(randomString)};`);
                            await tester.Run();
                            Assert.notStrictEqual(await tester.Require(), randomObject);
                            Assert.notDeepStrictEqual(await tester.Require(), randomObject);
                            Assert.strictEqual(await tester.Require(), randomString);
                        });
                });
        });
}
