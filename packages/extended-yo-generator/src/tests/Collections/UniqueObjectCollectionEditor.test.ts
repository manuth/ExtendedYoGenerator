import { doesNotThrow, ok, strictEqual, throws } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { UniqueObjectCollectionEditor } from "../../Collections/UniqueObjectCollectionEditor";
import { IUniqueObject } from "../../IUniqueObject";

/**
 * Registers tests for the {@link UniqueObjectCollection `UniqueObjectCollection<T>`} class.
 *
 * @param context
 * The test-context.
 */
export function UniqueObjectCollectionEditorTests(context: TestContext): void
{
    suite(
        nameof(UniqueObjectCollectionEditor),
        () =>
        {
            let collection: UniqueObjectCollectionEditor<IUniqueObject>;
            let randomItemGenerator: Generator<IUniqueObject>;
            let randomItem: IUniqueObject;

            suiteSetup(
                () =>
                {
                    randomItemGenerator = function*()
                    {
                        let i = 0;

                        while (true)
                        {
                            yield {
                                ID: context.Random.string(i++)
                            } as IUniqueObject;
                        }
                    }();
                });

            setup(
                () =>
                {
                    collection = new UniqueObjectCollectionEditor([]);
                    randomItem = randomItemGenerator.next().value;
                });

            suite(
                nameof<UniqueObjectCollectionEditor<any>>((collection) => collection.Get),
                () =>
                {
                    test(
                        `Checking whether items can be queried by their \`${nameof<IUniqueObject>((o) => o.ID)}\`…`,
                        () =>
                        {
                            collection.Add(randomItem);
                            strictEqual(collection.Get(randomItem.ID), randomItem);
                        });
                });

            suite(
                nameof<UniqueObjectCollectionEditor<IUniqueObject>>((collection) => collection.Replace),
                () =>
                {
                    test(
                        `Checking whether items can be replaced by their \`${nameof<IUniqueObject>((o) => o.ID)}\`…`,
                        () =>
                        {
                            let replacement = randomItemGenerator.next().value;
                            collection.AddRange([randomItem, replacement]);
                            collection.Replace(randomItem.ID, replacement);
                            ok(!collection.Items.some((item) => item === randomItem));
                            strictEqual(collection.Items.filter((item) => item === replacement).length, 2);
                        });
                });

            suite(
                nameof<UniqueObjectCollectionEditor<IUniqueObject>>((collection) => collection.Remove),
                () =>
                {
                    test(
                        `Checking whether items can be removed by their \`${nameof<IUniqueObject>((o) => o.ID)}\`…`,
                        () =>
                        {
                            let strippedItem = randomItemGenerator.next().value;
                            collection.Clear();
                            collection.AddRange([randomItem, strippedItem]);
                            collection.Remove(strippedItem.ID);
                            doesNotThrow(() => collection.Get(randomItem.ID));
                            throws(() => collection.Get(strippedItem.ID));
                        });
                });
        });
}
