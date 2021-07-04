import { doesNotThrow, ok, strictEqual, throws } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { PropertyResolverCollectionEditor } from "../../Collections/PropertyResolverCollectionEditor";
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
export function PropertyResolverCollectionEditorTests(context: TestContext): void
{
    suite(
        nameof(PropertyResolverCollectionEditor),
        () =>
        {
            /**
             * An implementation of the {@link PropertyResolverCollection `PropertyResolverCollection<TObject, TTarget>`} class for testing.
             */
            class MyCollection extends PropertyResolverCollectionEditor<IFileMapping<any, any>, FileMapping<any, any>>
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
            let collection: MyCollection;
            let fileMappingGenerator: globalThis.Generator<IFileMapping<any, any>>;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
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
                                ID: context.Random.string(i),
                                Destination: context.Random.string(i)
                            } as IFileMapping<any, any>;
                        }
                    }();

                    collection = new MyCollection(generator, []);
                });

            suite(
                nameof(PropertyResolverCollectionEditor.constructor),
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
                            strictEqual(collection.Items.length, items.length);
                            ok(items.every((item) => collection.Items.includes(item)));
                        });
                });

            suite(
                nameof<PropertyResolverCollectionEditor<any, any>>((collection) => collection.Replace),
                () =>
                {
                    test(
                        "Checking whether items can be replaced by their type…",
                        () =>
                        {
                            let strippedItem = new MyFileMapping(generator, fileMappingGenerator.next().value);
                            let replacement = new FileMapping(generator, fileMappingGenerator.next().value);
                            collection.Add(strippedItem);
                            ok(collection.Items.includes(strippedItem));
                            collection.Replace(MyFileMapping, replacement);
                            ok(!collection.Items.includes(strippedItem));
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
                                return collection.Items.map((fileMapping) => fileMapping.Object).includes(strippedItem);
                            };

                            collection.Add(strippedItem);
                            ok(assertion());
                            collection.Replace(MyFileMappingOptions, replacement);
                            ok(!assertion());
                            ok(collection.Items.includes(replacement));
                            throws(() => collection.Get(MyFileMappingOptions));
                        });

                    test(
                        "Checking whether options for creating new items can be provided as a replacement…",
                        () =>
                        {
                            let strippedItem = new MyFileMapping(generator, fileMappingGenerator.next().value);
                            let replacement = fileMappingGenerator.next().value;
                            collection.Add(strippedItem);
                            ok(collection.Items.includes(strippedItem));
                            collection.Replace(MyFileMapping, replacement);
                            ok(!collection.Items.includes(strippedItem));
                            ok(collection.Items.some((item) => item.Object === replacement));
                        });
                });

            suite(
                nameof<PropertyResolverCollectionEditor<any, any>>((collection) => collection.Add),
                () =>
                {
                    test(
                        "Checking whether new items can be added…",
                        () =>
                        {
                            let addition = new MyFileMapping(generator, fileMappingGenerator.next().value);
                            collection.Clear();
                            collection.Add(addition);
                            ok(collection.Items.includes(addition));
                            doesNotThrow(() => collection.Get(MyFileMapping));
                        });

                    test(
                        "Checking whether options for creating new items can be added…",
                        () =>
                        {
                            let addition = new MyFileMappingOptions(generator);
                            collection.Clear();
                            collection.Add(addition);
                            ok(collection.Items.some((item) => item.Object === addition));
                            doesNotThrow(() => collection.Get(MyFileMappingOptions));
                        });
                });
        });
}
