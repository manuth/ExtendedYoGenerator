import { strictEqual } from "assert";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ComponentCategory } from "../../Components/ComponentCategory";
import { IComponentCategory } from "../../Components/IComponentCategory";

/**
 * Provides tests for the {@link ComponentCategory `ComponentCategory<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function ComponentCategoryTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(ComponentCategory),
        () =>
        {
            let generator: TestGenerator;
            let category: ComponentCategory<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>>;

            let categoryOptions: IComponentCategory<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>> = {
                DisplayName: null,
                Components: []
            };

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
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
                nameof<ComponentCategory<any, any>>((category) => category.Components),
                () =>
                {
                    test(
                        `Checking whether changes made to the \`${nameof<ComponentCategory<any, any>>((c) => c.Components)}\` option immediately take affect…`,
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

                            strictEqual(category.Components[0].ID, testID);
                        });
                });
        });
}
