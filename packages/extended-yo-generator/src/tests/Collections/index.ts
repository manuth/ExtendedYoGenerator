import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ObjectCollectionTests } from "./ObjectCollection.test";
import { UniqueObjectCollectionTests } from "./UniqueObjectCollection.test";

/**
 * Registers tests for collections.
 *
 * @param context
 * The test-context.
 */
export function CollectionTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Collections",
        () =>
        {
            ObjectCollectionTests();
            UniqueObjectCollectionTests();
        });
}
