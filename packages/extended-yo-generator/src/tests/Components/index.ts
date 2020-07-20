import { TestContext, TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { ComponentTests } from "./Component.test";
import { ComponentCategoryTests } from "./ComponentCategory.test";
import { ComponentCollectionTests } from "./ComponentCollection.test";
import { FileMappingTests } from "./FileMapping.test";
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
            FileMappingTests(context);
            ComponentTests(context);
            ComponentCategoryTests(context);
            ComponentCollectionTests(context);
        });
}
