import Assert = require("assert");
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ComponentCategory } from "../../Components/ComponentCategory";
import { IComponentCategory } from "../../Components/IComponentCategory";

/**
 * Provides tests for the `ComponentCategory` class.
 *
 * @param context
 * The test-context.
 */
export function ComponentCategoryTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "ComponentCategory",
        () =>
        {
            let generator: TestGenerator;
            let category: ComponentCategory<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>>;

            let categoryOptions: IComponentCategory<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>> = {
                DisplayName: null,
                Components: []
            };

            suiteSetup(
                async () =>
                {
                    generator = await context.Generator;
                    category = new ComponentCategory(generator, categoryOptions);
                });

            setup(
                () =>
                {
                    categoryOptions.DisplayName = null;
                    categoryOptions.Components = [];
                });

            suite(
                "Components",
                () =>
                {
                    test(
                        "Checking whether changes to the `Components` option immediately take affect…",
                        () =>
                        {
                            let testID = "this-is-a-test";
                            categoryOptions.Components = [
                                {
                                    ID: testID,
                                    DisplayName: null,
                                    FileMappings: []
                                }
                            ];

                            Assert.strictEqual(category.Components[0].ID, testID);
                        });
                });
        });
}
