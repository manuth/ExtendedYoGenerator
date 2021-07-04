import { doesNotThrow } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { FileMappingCollectionEditor } from "../../Collections/FileMappingCollectionEditor";
import { FileMapping } from "../../Components/FileManagement/FileMapping";
import { IFileMapping } from "../../Components/FileManagement/IFileMapping";
import { Generator } from "../../Generator";

/**
 * Registers tests for the {@link FileMappingOptionCollection `FileMappingOptionCollection`} class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingCollectionEditorTests(context: TestContext): void
{
    suite(
        nameof(FileMappingCollectionEditor),
        () =>
        {
            let generator: Generator;
            let collection: FileMappingCollectionEditor;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    collection = new FileMappingCollectionEditor(generator, []);
                });

            suite(
                nameof<FileMappingCollectionEditor>((collection) => collection.Add),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<FileMapping<any, any>>()}\`s are created correctly…`,
                        () =>
                        {
                            let fileMapping: IFileMapping<any, any> = {
                                ID: context.RandomString,
                                Destination: ""
                            };

                            collection.Add(fileMapping);
                            doesNotThrow(() => collection.Get(fileMapping.ID));
                        });
                });
        });
}
