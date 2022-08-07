import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ComponentTests } from "./Component.test.js";
import { ComponentCategoryTests } from "./ComponentCategory.test.js";
import { ComponentCollectionTests } from "./ComponentCollection.test.js";
import { FileManagementTests } from "./FileManagement/index.js";
import { ResolvingTests } from "./Resolving/index.js";

/**
 * Registers tests for components.
 *
 * @param context
 * The test-context.
 */
export function ComponentsTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            ResolvingTests(context);
            FileManagementTests(context);
            ComponentTests(context);
            ComponentCategoryTests(context);
            ComponentCollectionTests(context);
        });
}
