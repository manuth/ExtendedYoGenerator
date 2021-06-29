import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { FileMappingTests } from "./FileMapping.test";

/**
 * Registers tests related to file-management.
 *
 * @param context
 * The test-context.
 */
export function FileManagementTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "FileManagement",
        () =>
        {
            FileMappingTests(context);
        });
}
