import { strictEqual } from "assert";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ComponentCollection } from "../../Components/ComponentCollection";
import { IComponentCollection } from "../../Components/IComponentCollection";

/**
 * Provides tests for the `ComponentCollection` class.
 *
 * @param context
 * The test-context.
 */
export function ComponentCollectionTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "ComponentCollection",
        () =>
        {
            let generator: TestGenerator;
            let collection: ComponentCollection<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>>;

            let collectionOptions: IComponentCollection<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>> = {
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
                "Categories",
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

                            strictEqual(collection.Categories[0].DisplayName, testName);
                        });
                });
        });
}
