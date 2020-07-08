import Assert = require("assert");
import { ComponentCollection } from "../../Components/ComponentCollection";
import { IComponentCollection } from "../../Components/IComponentCollection";
import { TestGenerator } from "../Generator/TestGenerator/TestGenerator";
import { TestContext } from "../TestContext";

/**
 * Provides tests for the `ComponentCollection` class.
 *
 * @param context
 * The test-context.
 */
export function ComponentCollectionTests(context: TestContext): void
{
    suite(
        "ComponentCollection",
        () =>
        {
            let generator: TestGenerator;
            let collection: ComponentCollection<any>;

            let collectionOptions: IComponentCollection<any> = {
                Question: null,
                Categories: []
            };

            suiteSetup(
                async () =>
                {
                    generator = await context.Generator;
                    collection = new ComponentCollection(generator, collectionOptions);
                });

            setup(
                () =>
                {
                    collectionOptions.Question = null;
                    collectionOptions.Categories = [];
                });

            suite(
                "Array<ComponentCategory<TSettings>>",
                () =>
                {
                    test(
                        "Checking whether changes to the `Categories` option immediately take affect…",
                        () =>
                        {
                            let testName = "This is a test";
                            collectionOptions.Categories = [
                                {
                                    DisplayName: testName,
                                    Components: []
                                }
                            ];

                            Assert.strictEqual(collection.Categories[0].DisplayName, testName);
                        });
                });
        });
}
