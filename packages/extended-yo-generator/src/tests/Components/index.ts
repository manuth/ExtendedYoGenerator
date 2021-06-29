import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ComponentTests } from "./Component.test";
import { ComponentCategoryTests } from "./ComponentCategory.test";
import { ComponentCollectionTests } from "./ComponentCollection.test";
import { FileManagementTests } from "./FileManagement";
import { ResolvingTests } from "./Resolving";

/**
 * Registers tests for components.
 *
 * @param context
 * The test-context to use.
 */
export function ComponentsTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Components",
        () =>
        {
            ResolvingTests(context);
            FileManagementTests(context);
            ComponentTests(context);
            ComponentCategoryTests(context);
            ComponentCollectionTests(context);
        });
}
