import { doesNotThrow, ok, strictEqual, throws } from "assert";
import { UniqueObjectCollection } from "../../Collections/UniqueObjectCollection";
import { IUniqueObject } from "../../IUniqueObject";

/**
 * Registers tests for the {@link UniqueObjectCollection `UniqueObjectCollection<T>`} class.
 */
export function UniqueObjectCollectionTests(): void
{
    suite(
        nameof(UniqueObjectCollection),
        () =>
        {
            let item: IUniqueObject;
            let testItem: IUniqueObject;
            let collection: UniqueObjectCollection<IUniqueObject>;

            suiteSetup(
                () =>
                {
                    item = {
                        ID: "item"
                    };

                    testItem = {
                        ID: "testItem"
                    };
                });

            setup(
                () =>
                {
                    collection = new UniqueObjectCollection(
                        [
                            item,
                            testItem
                        ]);
                });

            suite(
                nameof<UniqueObjectCollection<any>>((collection) => collection.Get),
                () =>
                {
                    test(
                        `Checking whether items can be queried by their \`${nameof<IUniqueObject>((o) => o.ID)}\`…`,
                        () =>
                        {
                            strictEqual(collection.Get(item.ID), item);
                        });
                });

            suite(
                nameof<UniqueObjectCollection<IUniqueObject>>((collection) => collection.Replace),
                () =>
                {
                    test(
                        `Checking whether items can be replaced by their \`${nameof<IUniqueObject>((o) => o.ID)}\`…`,
                        () =>
                        {
                            collection.Clear();
                            collection.push(testItem, item);
                            collection.Replace(testItem.ID, item);
                            ok(!collection.some((item) => item === testItem));
                            strictEqual(collection.filter((item) => item === item).length, 2);
                        });
                });

            suite(
                nameof<UniqueObjectCollection<IUniqueObject>>((collection) => collection.Remove),
                () =>
                {
                    test(
                        `Checking whether items can be removed by their \`${nameof<IUniqueObject>((o) => o.ID)}\`…`,
                        () =>
                        {
                            collection.Clear();
                            collection.push(testItem, item);
                            collection.Remove(testItem.ID);
                            doesNotThrow(() => collection.Get(item.ID));
                            throws(() => collection.Get(testItem.ID));
                        });
                });
        });
}
