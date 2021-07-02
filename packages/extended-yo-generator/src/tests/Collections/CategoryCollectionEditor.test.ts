import { doesNotThrow } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { CategoryCollectionEditor } from "../../Collections/CategoryCollectionEditor";
import { ComponentCategory } from "../../Components/ComponentCategory";
import { IComponentCategory } from "../../Components/IComponentCategory";
import { Generator } from "../../Generator";

/**
 * Registers tests for the {@link CategoryOptionCollection `CategoryOptionCollection`} class.
 *
 * @param context
 * The test-context.
 */
export function CategoryCollectionEditorTests(context: TestContext): void
{
    suite(
        nameof(CategoryCollectionEditor),
        () =>
        {
            let random: Random;
            let generator: Generator;
            let collection: CategoryCollectionEditor;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    random = new Random();
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    collection = new CategoryCollectionEditor(generator, []);
                });

            suite(
                nameof<CategoryCollectionEditor>((collection) => collection.Add),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<ComponentCategory<any, any>>()}\`s are created correctly…`,
                        () =>
                        {
                            let category: IComponentCategory<any, any> = {
                                ID: random.string(10),
                                DisplayName: "",
                                Components: []
                            };

                            collection.Add(category);
                            doesNotThrow(() => collection.Get(category.ID));
                        });
                });
        });
}
