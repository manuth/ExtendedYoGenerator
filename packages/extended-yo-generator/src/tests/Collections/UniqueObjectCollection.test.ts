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
            let staticItem: IUniqueObject;
            let testItem: IUniqueObject;
            let collection: UniqueObjectCollection<IUniqueObject>;

            suiteSetup(
                () =>
                {
                    staticItem = {
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
                            staticItem,
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
                            strictEqual(collection.Get(staticItem.ID), staticItem);
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
                            collection.push(testItem, staticItem);
                            collection.Replace(testItem.ID, staticItem);
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
                            collection.push(testItem, staticItem);
                            collection.Remove(testItem.ID);
                            doesNotThrow(() => collection.Get(staticItem.ID));
                            throws(() => collection.Get(testItem.ID));
                        });
                });
        });
}
