import { basename } from "path";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { CategoryCollectionEditorTests } from "./CategoryCollectionEditor.test";
import { ComponentCollectionEditorTests } from "./ComponentCollectionEditor.test";
import { FileMappingCollectionEditorTests } from "./FileMappingCollectionEditor.test";
import { ObjectCollectionEditorTests } from "./ObjectCollectionEditor.test";
import { PropertyResolverCollectionEditorTests } from "./PropertyResolverCollectionEditor.test";
import { UniqueObjectCollectionEditorTests } from "./UniqueObjectCollectionEditor.test";

/**
 * Registers tests for collections.
 *
 * @param context
 * The test-context.
 */
export function CollectionTests(context: TestContext<TestGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            let genericContext = new TestContext(TestGenerator.Path);
            ObjectCollectionEditorTests();
            UniqueObjectCollectionEditorTests(context);
            PropertyResolverCollectionEditorTests(genericContext);
            FileMappingCollectionEditorTests(genericContext);
            ComponentCollectionEditorTests(genericContext);
            CategoryCollectionEditorTests(genericContext);
        });
}
