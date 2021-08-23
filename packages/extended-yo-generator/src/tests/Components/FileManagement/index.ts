import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { FileMappingTests } from "./FileMapping.test";
import { FileMappingOptionsTests } from "./FileMappingOptions.test";

/**
 * Registers tests related to file-management.
 *
 * @param context
 * The test-context.
 */
export function FileManagementTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            FileMappingOptionsTests(context);
            FileMappingTests(context);
        });
}
