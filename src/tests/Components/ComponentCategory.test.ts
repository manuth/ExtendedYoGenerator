import Assert = require("assert");
import { TestContext } from "../TestContext";
import { TestGenerator } from "../TestGenerator";
import { ComponentCategory } from "../../Components/ComponentCategory";
import { IComponentCategory } from "../../Components/IComponentCategory";

/**
 * Provides tests for the `ComponentCategory` class.
 *
 * @param context
 * The test-context.
 */
export function ComponentCategoryTests(context: TestContext)
{
    suite(
        "ComponentCategory",
        () =>
        {
            let generator: TestGenerator;
            let category: ComponentCategory<any>;

            let categoryOptions: IComponentCategory<any> = {
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
                "Array<Component<TSettings>> Components",
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
