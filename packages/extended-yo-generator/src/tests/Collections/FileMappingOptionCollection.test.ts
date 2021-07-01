import { doesNotThrow } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { FileMappingOptionCollection } from "../../Collections/FileMappingOptionCollection";
import { FileMapping } from "../../Components/FileManagement/FileMapping";
import { IFileMapping } from "../../Components/FileManagement/IFileMapping";
import { Generator } from "../../Generator";

/**
 * Registers tests for the {@link FileMappingOptionCollection `FileMappingOptionCollection`} class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingOptionCollectionTests(context: TestContext): void
{
    suite(
        nameof(FileMappingOptionCollection),
        () =>
        {
            let random: Random;
            let generator: Generator;
            let collection: FileMappingOptionCollection;

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
                    collection = new FileMappingOptionCollection(generator, []);
                });

            suite(
                nameof<FileMappingOptionCollection>((collection) => collection.Add),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<FileMapping<any, any>>()}\`s are created correctly…`,
                        () =>
                        {
                            let fileMapping: IFileMapping<any, any> = {
                                ID: random.string(10),
                                Destination: ""
                            };

                            collection.Add(fileMapping);
                            doesNotThrow(() => collection.Get(fileMapping.ID));
                        });
                });
        });
}
