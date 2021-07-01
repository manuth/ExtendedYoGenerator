import { doesNotThrow, ok, strictEqual, throws } from "assert";
import { Random } from "random-js";
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
            let random: Random;
            let collection: UniqueObjectCollection<IUniqueObject>;
            let randomItemGenerator: Generator<IUniqueObject>;
            let randomItem: IUniqueObject;

            suiteSetup(
                () =>
                {
                    random = new Random();

                    randomItemGenerator = function*()
                    {
                        let i = 0;

                        while (true)
                        {
                            yield {
                                ID: random.string(i++)
                            } as IUniqueObject;
                        }
                    }();
                });

            setup(
                () =>
                {
                    collection = new UniqueObjectCollection([]);
                    randomItem = randomItemGenerator.next().value;
                });

            suite(
                nameof<UniqueObjectCollection<any>>((collection) => collection.Get),
                () =>
                {
                    test(
                        `Checking whether items can be queried by their \`${nameof<IUniqueObject>((o) => o.ID)}\`…`,
                        () =>
                        {
                            collection.push(randomItem);
                            strictEqual(collection.Get(randomItem.ID), randomItem);
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
                            let replacement = randomItemGenerator.next().value;
                            collection.push(randomItem, replacement);
                            collection.Replace(randomItem.ID, replacement);
                            ok(!collection.some((item) => item === randomItem));
                            strictEqual(collection.filter((item) => item === replacement).length, 2);
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
                            let strippedItem = randomItemGenerator.next().value;
                            collection.Clear();
                            collection.push(randomItem, strippedItem);
                            collection.Remove(strippedItem.ID);
                            doesNotThrow(() => collection.Get(randomItem.ID));
                            throws(() => collection.Get(strippedItem.ID));
                        });
                });
        });
}
