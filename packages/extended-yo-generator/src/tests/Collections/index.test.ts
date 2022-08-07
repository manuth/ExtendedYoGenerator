import { basename } from "node:path";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { CategoryCollectionEditorTests } from "./CategoryCollectionEditor.test.js";
import { ComponentCollectionEditorTests } from "./ComponentCollectionEditor.test.js";
import { FileMappingCollectionEditorTests } from "./FileMappingCollectionEditor.test.js";
import { ObjectCollectionEditorTests } from "./ObjectCollectionEditor.test.js";
import { PropertyResolverCollectionEditorTests } from "./PropertyResolverCollectionEditor.test.js";
import { UniqueObjectCollectionEditorTests } from "./UniqueObjectCollectionEditor.test.js";

/**
 * Registers tests for collections.
 *
 * @param context
 * The test-context.
 */
export function CollectionTests(context: TestContext<TestGenerator>): void
{
    suite(
        basename(basename(new URL(".", import.meta.url).pathname)),
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
