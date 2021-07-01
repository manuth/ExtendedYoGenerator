import { doesNotThrow } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { CategoryOptionCollection } from "../../Collections/CategoryOptionCollection";
import { ComponentCategory } from "../../Components/ComponentCategory";
import { IComponentCategory } from "../../Components/IComponentCategory";
import { Generator } from "../../Generator";

/**
 * Registers tests for the {@link CategoryOptionCollection `CategoryOptionCollection`} class.
 *
 * @param context
 * The test-context.
 */
export function CategoryOptionCollectionTests(context: TestContext): void
{
    suite(
        nameof(CategoryOptionCollection),
        () =>
        {
            let random: Random;
            let generator: Generator;
            let collection: CategoryOptionCollection;

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
                    collection = new CategoryOptionCollection(generator, []);
                });

            suite(
                nameof<CategoryOptionCollection>((collection) => collection.Add),
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
