import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { CategoryOptionCollectionTests } from "./CategoryOptionCollection.test";
import { ComponentOptionCollectionTests } from "./ComponentOptionCollection.test";
import { FileMappingOptionCollectionTests } from "./FileMappingOptionCollection.test";
import { ObjectCollectionTests } from "./ObjectCollection.test";
import { PropertyResolverCollectionTests } from "./PropertyResolverCollection.test";
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
            PropertyResolverCollectionTests(context);
            FileMappingOptionCollectionTests(context);
            ComponentOptionCollectionTests(context);
            CategoryOptionCollectionTests(context);
        });
}
