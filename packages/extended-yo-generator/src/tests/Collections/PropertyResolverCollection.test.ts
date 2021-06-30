import { doesNotThrow, ok, strictEqual, throws } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { PropertyResolverCollection } from "../../Collections/PropertyResolverCollection";
import { FileMapping } from "../../Components/FileManagement/FileMapping";
import { FileMappingOptions } from "../../Components/FileManagement/FileMappingOptions";
import { IFileMapping } from "../../Components/FileManagement/IFileMapping";
import { Generator } from "../../Generator";
import { IGenerator } from "../../IGenerator";

/**
 * Registers tests for the {@link PropertyResolverCollection `PropertyResolverCollection<TObject, TTarget>`} class.
 *
 * @param context
 * The test-context.
 */
export function PropertyResolverCollectionTests(context: TestContext): void
{
    suite(
        nameof(PropertyResolverCollection),
        () =>
        {
            /**
             * An implementation of the {@link PropertyResolverCollection `PropertyResolverCollection<TObject, TTarget>`} class for testing.
             */
            class MyCollection extends PropertyResolverCollection<IFileMapping<any, any>, FileMapping<any, any>>
            {
                /**
                 * @inheritdoc
                 */
                public override get Generator(): IGenerator<any, any>
                {
                    return super.Generator;
                }

                /**
                 * @inheritdoc
                 *
                 * @param options
                 * The options for creating the item.
                 *
                 * @returns
                 * The newly created item.
                 */
                protected CreateItem(options: IFileMapping<any, any>): FileMapping<any, any>
                {
                    return new FileMapping(this.Generator, options);
                }
            }

            /**
             * Provides a custom implementation of the {@link FileMapping `FileMapping<TSettings, TOptions>`} class.
             */
            class MyFileMapping extends FileMapping<any, any>
            { }

            /**
             * Provides a custom implementation of the {@link FileMappingOptions `FileMappingOptions<TSettings, TOptions>`} class.
             */
            class MyFileMappingOptions extends FileMappingOptions<any, any>
            {
                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return null;
                }
            }

            let generator: Generator;
            let random: Random;
            let collection: MyCollection;
            let fileMappingGenerator: globalThis.Generator<IFileMapping<any, any>>;

            suiteSetup(
                async () =>
                {
                    generator = await context.Generator;
                    random = new Random();
                });

            setup(
                () =>
                {
                    fileMappingGenerator = function*()
                    {
                        let i = 0;

                        while (true)
                        {
                            yield {
                                ID: random.string(i),
                                Destination: random.string(i)
                            } as IFileMapping<any, any>;
                        }
                    }();

                    collection = new MyCollection(generator, []);
                });

            suite(
                nameof(PropertyResolverCollection.constructor),
                () =>
                {
                    test(
                        "Checking whether whether the collection can be initialized correctly…",
                        () =>
                        {
                            let items = [
                                fileMappingGenerator.next().value,
                                fileMappingGenerator.next().value
                            ];

                            collection = new MyCollection(generator, items);
                            strictEqual(collection.Generator, generator);
                            strictEqual(collection.length, items.length);
                            ok(items.every((item) => collection.includes(item)));
                        });
                });

            suite(
                nameof<PropertyResolverCollection<any, any>>((collection) => collection.Replace),
                () =>
                {
                    test(
                        "Checking whether items can be replaced by their type…",
                        () =>
                        {
                            let strippedItem = new MyFileMapping(generator, fileMappingGenerator.next().value);
                            let replacement = new FileMapping(generator, fileMappingGenerator.next().value);
                            collection.push(strippedItem);
                            ok(collection.includes(strippedItem));
                            collection.Replace(MyFileMapping, replacement);
                            ok(!collection.includes(strippedItem));
                            throws(() => collection.Get(MyFileMapping));
                        });

                    test(
                        "Checking whether items cam be replaced by their object's type…",
                        () =>
                        {
                            let strippedItem = new MyFileMappingOptions(generator);
                            let replacement = new FileMapping(generator, fileMappingGenerator.next().value);

                            let assertion = (): boolean =>
                            {
                                return collection.map((fileMapping) => fileMapping.Object).includes(strippedItem);
                            };

                            collection.Add(strippedItem);
                            ok(assertion());
                            collection.Replace(MyFileMappingOptions, replacement);
                            ok(!assertion());
                            ok(collection.includes(replacement));
                            throws(() => collection.Get(MyFileMappingOptions));
                        });

                    test(
                        "Checking whether options for creating new items can be provided as a replacement…",
                        () =>
                        {
                            let strippedItem = new MyFileMapping(generator, fileMappingGenerator.next().value);
                            let replacement = fileMappingGenerator.next().value;
                            collection.Add(strippedItem);
                            ok(collection.includes(strippedItem));
                            collection.Replace(MyFileMapping, replacement);
                            ok(!collection.includes(strippedItem));
                            ok(collection.some((item) => item.Object === replacement));
                        });
                });

            suite(
                nameof<PropertyResolverCollection<any, any>>((collection) => collection.Add),
                () =>
                {
                    test(
                        "Checking whether new items can be added…",
                        () =>
                        {
                            let addition = new MyFileMapping(generator, fileMappingGenerator.next().value);
                            collection.Clear();
                            collection.Add(addition);
                            ok(collection.includes(addition));
                            doesNotThrow(() => collection.Get(MyFileMapping));
                        });

                    test(
                        "Checking whether options for creating new items can be added…",
                        () =>
                        {
                            let addition = new MyFileMappingOptions(generator);
                            collection.Clear();
                            collection.Add(addition);
                            ok(collection.some((item) => item.Object === addition));
                            doesNotThrow(() => collection.Get(MyFileMappingOptions));
                        });
                });
        });
}
