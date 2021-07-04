import { doesNotThrow, ok, strictEqual, throws } from "assert";
import { TempDirectory, TempFile, TempFileSystem } from "@manuth/temp-files";
import { statSync } from "fs-extra";
import { ObjectCollectionEditor } from "../../Collections/ObjectCollectionEditor";
import { Predicate } from "../../Predicate";

/**
 * Registers tests for the {@link ObjectCollection `ObjectCollection<T>`} class.
 */
export function ObjectCollectionEditorTests(): void
{
    suite(
        nameof(ObjectCollectionEditor),
        () =>
        {
            let tempDir: TempDirectory;
            let tempFile: TempFile;
            let source: TempFileSystem[];
            let collection: ObjectCollectionEditor<TempFileSystem>;

            suiteSetup(
                () =>
                {
                    tempDir = new TempDirectory();
                    tempFile = new TempFile();
                });

            suiteTeardown(
                () =>
                {
                    tempDir.Dispose();
                    tempFile.Dispose();
                });

            setup(
                () =>
                {
                    source = [
                        tempDir,
                        tempFile
                    ];

                    collection = new ObjectCollectionEditor(source);
                });

            suite(
                nameof(ObjectCollectionEditor.constructor),
                () =>
                {
                    test(
                        "Checking whether all items are added to the collection…",
                        () =>
                        {
                            collection.Items.includes(tempDir);
                            collection.Items.includes(tempFile);
                        });
                });

            suite(
                nameof<ObjectCollectionEditor<any>>((collection) => collection.Items),
                () =>
                {
                    test(
                        "Checking whether changes are applied lazily…",
                        () =>
                        {
                            collection.Add(null);

                            ok(
                                source.every(
                                    (item) =>
                                    {
                                        return collection.Items.includes(item);
                                    }));

                            ok(collection.Items.includes(null));
                            source.splice(0, source.length);
                            ok(collection.Items.includes(null));
                            strictEqual(collection.Items.length, 1);
                        });
                });

            suite(
                nameof<ObjectCollectionEditor<any>>((collection) => collection.Get),
                () =>
                {
                    test(
                        `Checking whether entries can be queried by their \`${nameof(Object.constructor)}\`…`,
                        () =>
                        {
                            strictEqual(collection.Get(TempDirectory), tempDir);
                            strictEqual(collection.Get(TempFile), tempFile);
                            strictEqual(collection.Get(TempFileSystem), collection.Items.find((item) => item instanceof TempFileSystem));
                        });

                    test(
                        `Checking whether entries can be queried by a custom \`${nameof<Predicate<any>>()}\`…`,
                        async () =>
                        {
                            strictEqual(
                                collection.Get((item: TempFileSystem) => statSync(item.FullName).isDirectory()),
                                collection.Get(TempDirectory));
                        });
                });

            suite(
                nameof<ObjectCollectionEditor<any>>((collection) => collection.Add),
                () =>
                {
                    test(
                        "Checking whether a new element can be added…",
                        () =>
                        {
                            collection.Clear();
                            ok(!collection.Items.includes(tempDir));
                            collection.Add(tempDir);
                            ok(collection.Items.includes(tempDir));
                        });
                });

            suite(
                nameof<ObjectCollectionEditor<any>>((collection) => collection.AddRange),
                () =>
                {
                    test(
                        "Checking whether multiple elements can be added at once…",
                        () =>
                        {
                            collection.Clear();
                            ok(!collection.Items.includes(tempDir));
                            ok(!collection.Items.includes(tempFile));

                            collection.AddRange(
                                [
                                    tempDir,
                                    tempFile
                                ]);

                            ok(collection.Items.includes(tempDir));
                            ok(collection.Items.includes(tempFile));
                        });
                });

            suite(
                nameof<ObjectCollectionEditor<any>>((collection) => collection.Replace),
                () =>
                {
                    test(
                        "Checking whether items can be replaced by their type…",
                        () =>
                        {
                            collection.Clear();
                            collection.Add(tempDir);
                            collection.Replace(TempDirectory, tempFile);

                            throws(() => collection.Get(TempDirectory));
                            strictEqual(collection.Get(TempFile), tempFile);
                            ok(!collection.Items.includes(tempDir));
                            ok(collection.Items.includes(tempFile));
                        });

                    test(
                        `Checking whether items can be replaced using \`${nameof<Predicate<any>>()}\`s…`,
                        () =>
                        {
                            let staticItem = "static";
                            let stripped = "stripped";
                            let replacement = "replacement";

                            let collection = new ObjectCollectionEditor<string>(
                                [
                                    staticItem,
                                    stripped,
                                    stripped
                                ]);

                            collection.Replace((item: string) => item === stripped, replacement);
                            ok(collection.Items.includes(staticItem));
                            ok(!collection.Items.includes(stripped));
                            strictEqual(collection.Items.filter((item) => item === replacement).length, 2);
                        });
                });

            suite(
                nameof<ObjectCollectionEditor<any>>((collection) => collection.Remove),
                () =>
                {
                    test(
                        "Checking whether items can be removed by their type…",
                        () =>
                        {
                            collection.Remove(TempDirectory);
                            ok(!collection.Items.includes(tempDir));
                            ok(collection.Items.includes(tempFile));
                        });

                    test(
                        `Checking whether items can be removed by a \`${nameof<Predicate<any>>()}\`s…`,
                        () =>
                        {
                            collection.Remove((item: TempFileSystem) => statSync(item.FullName).isFile());
                            throws(() => collection.Get(TempFile));
                            doesNotThrow(() => collection.Get(TempDirectory));
                        });
                });

            suite(
                nameof<ObjectCollectionEditor<any>>((collection) => collection.Clear),
                () =>
                {
                    test(
                        "Checking whether the collection can be cleared…",
                        () =>
                        {
                            collection.Clear();
                            strictEqual(collection.Items.length, 0);
                        });
                });
        });
}
