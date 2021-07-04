import { doesNotThrow, notStrictEqual, strictEqual } from "assert";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ITempFileSystemOptions, TempDirectory } from "@manuth/temp-files";
import { ObjectExtensionFactory } from "../../Extensibility/ObjectExtensionFactory";

/**
 * Registers tests for the {@link ObjectExtensionFactory `ObjectExtensionFactory<T>`} class.
 *
 * @param context
 * The text-context.
 */
export function ObjectExtensionFactoryTests(context: TestContext<TestGenerator>): void
{
    suite(
        nameof(ObjectExtensionFactory),
        () =>
        {
            /**
             * Provides an extension for the {@link TempDirectory `TempDirectory`} class.
             */
            class TempDirectoryExtension extends ObjectExtensionFactory.Create(TempDirectory)
            {
                /**
                 * @inheritdoc
                 */
                public override get Base(): TempDirectory
                {
                    return super.Base;
                }
            }

            /**
             * Provides a custom extension for the {@link TempDirectory `TempDirectory`} class.
             */
            class CustomTempDirectoryExtension extends ObjectExtensionFactory.Create(TempDirectoryExtension)
            {
                /**
                 * @inheritdoc
                 *
                 * @param options
                 * The options for the temporary directory.
                 *
                 * @returns
                 * The newly initialized base of the extension.
                 */
                protected override InitializeBase(options: ITempFileSystemOptions): TempDirectory
                {
                    return new TempDirectory(
                        {
                            Suffix: suffix
                        });
                }
            }

            let suffix: string;
            let extensionTest: TempDirectoryExtension;
            let customExtensionTest: TempDirectoryExtension;

            suiteSetup(
                () =>
                {
                    suffix = context.RandomString;
                });

            setup(
                () =>
                {
                    extensionTest = new TempDirectoryExtension();
                    customExtensionTest = new CustomTempDirectoryExtension();
                });

            suite(
                nameof<ObjectExtensionFactory<any>>((factory) => factory.Create),
                () =>
                {
                    test(
                        "Checking whether object-extensions can be created…",
                        () =>
                        {
                            doesNotThrow(() => new TempDirectoryExtension());
                        });

                    test(
                        "Checking whether the initialization of the base object can be customized…",
                        () =>
                        {
                            notStrictEqual(extensionTest.Base.Options.Suffix, suffix);
                            strictEqual(customExtensionTest.Base.Options.Suffix, suffix);
                        });
                });
        });
}
