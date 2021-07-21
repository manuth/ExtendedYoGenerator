import { doesNotThrow, notStrictEqual, ok, strictEqual } from "assert";
import { dirname } from "path";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ITempFileSystemOptions, TempDirectory, TempFile, TempFileSystem } from "@manuth/temp-files";
import { Diagnostic, LanguageServiceTester } from "@manuth/typescript-languageservice-tester";
import { printNode, Project, SourceFile, SyntaxKind, ts } from "ts-morph";
import { ObjectExtensionFactory } from "../../Extensibility/ObjectExtensionFactory";
import { TestConstants } from "../TestConstants";

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
                    let tempFiles: TempFile[];
                    let fileWithTypeParams: SourceFile;
                    let fileWithoutTypeParams: SourceFile;
                    let fileWIthIncorrectTypeParams: SourceFile;
                    let tester: LanguageServiceTester;

                    /**
                     * Gets all {@link Diagnostic `Diagnostic`}s about incorrect type-parameters in the specified {@link sourceFile `sourceFile`}.
                     *
                     * @param sourceFile
                     * The source-file to search through.
                     *
                     * @returns
                     * The type-param errors which exist in the specified {@link sourceFile `sourceFile`}.
                     */
                    async function GetTypeParamErrors(sourceFile: SourceFile): Promise<Diagnostic[]>
                    {
                        return (
                            await tester.AnalyzeCode(
                                sourceFile.print(),
                                "TS",
                                sourceFile.getFilePath())).Diagnostics.filter(
                                    (diagnostic) =>
                                    {
                                        return diagnostic.Code === 2508;
                                    });
                    }

                    suiteSetup(
                        async function()
                        {
                            this.timeout(30 * 1000);
                            let project = new Project();
                            tempFiles = [];

                            /**
                             * Creates a new {@link SourceFile `SourceFile`}.
                             *
                             * @param genericType
                             * A value indicating whether a generic type should be passed to {@link ObjectExtensionFactory.Create `Create`}.
                             *
                             * @param typeParam
                             * A value indicating whether a type-parameter should be added after the {@link ObjectExtensionFactory.Create `Create`} call.
                             *
                             * @returns
                             * The newly created {@link SourceFile `SourceFile`}.
                             */
                            function CreateSourceFile(genericType: boolean, typeParam: boolean): SourceFile
                            {
                                let tempFile = new TempFile(
                                    {
                                        Directory: TestConstants.TestDirectory
                                    });

                                let file = project.createSourceFile(
                                    tempFile.FullName,
                                    null,
                                    {
                                        overwrite: true
                                    });

                                file.addImportDeclaration(
                                    {
                                        moduleSpecifier: file.getRelativePathAsModuleSpecifierTo(dirname(TestConstants.Package.FileName)),
                                        namedImports: [
                                            {
                                                name: nameof(ObjectExtensionFactory)
                                            }
                                        ]
                                    });

                                file.addClass(
                                    {
                                        name: "Test",
                                        extends: printNode(
                                            ts.factory.createExpressionWithTypeArguments(
                                                ts.factory.createCallExpression(
                                                    ts.factory.createPropertyAccessExpression(
                                                        ts.factory.createIdentifier(nameof(ObjectExtensionFactory)),
                                                        nameof<ObjectExtensionFactory<any>>((factory) => factory.Create)),
                                                    [],
                                                    [
                                                        genericType ?
                                                            ts.factory.createIdentifier(nameof(Array)) :
                                                            ts.factory.createPropertyAccessExpression(
                                                                ts.factory.createIdentifier(nameof(console)),
                                                                nameof(console.Console))
                                                    ]),
                                                typeParam ?
                                                    [
                                                        ts.factory.createKeywordTypeNode(SyntaxKind.StringKeyword)
                                                    ] :
                                                    [])
                                        )
                                    });

                                tempFiles.push(tempFile);
                                return file;
                            }

                            fileWithTypeParams = CreateSourceFile(true, true);
                            fileWithoutTypeParams = CreateSourceFile(false, false);
                            fileWIthIncorrectTypeParams = CreateSourceFile(false, true);
                            tester = new LanguageServiceTester(dirname(TempFileSystem.TempName()));
                            await tester.Install();
                        });

                    suiteTeardown(
                        () =>
                        {
                            for (let tempFile of tempFiles)
                            {
                                tempFile.Dispose();
                            }

                            tester.Dispose();
                        });

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

                    test(
                        "Checking whether type-parameters can be passed to object-extensions…",
                        async function()
                        {
                            this.timeout(2 * 60 * 1000);
                            this.slow(1 * 60 * 1000);
                            strictEqual((await GetTypeParamErrors(fileWithTypeParams)).length, 0);
                            strictEqual((await GetTypeParamErrors(fileWithoutTypeParams)).length, 0);
                            ok((await GetTypeParamErrors(fileWIthIncorrectTypeParams)).length > 0);
                        });
                });
        });
}
