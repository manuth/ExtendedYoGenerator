import { TestContext } from "../TestContext";
import { ResolvingTests } from "./Resolving";
import { FileMappingTests } from "./FileMapping.test";
import { ComponentTests } from "./Component.test";
import { ComponentCategoryTests } from "./ComponentCategory.test";
import { ComponentCollectionTests } from "./ComponentCollection.test";

/**
 * Registers tests for components.
 *
 * @param context
 * The test-context to use.
 */
export function ComponentsTests(context: TestContext)
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
