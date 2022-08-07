import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { FileMappingTests } from "./FileMapping.test.js";
import { FileMappingOptionsTests } from "./FileMappingOptions.test.js";

/**
 * Registers tests related to file-management.
 *
 * @param context
 * The test-context.
 */
export function FileManagementTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            FileMappingOptionsTests(context);
            FileMappingTests(context);
        });
}
