import { deepStrictEqual, doesNotThrow, notStrictEqual, ok, strictEqual } from "node:assert";
import { ITestGeneratorSettings, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { GeneratorOptions } from "yeoman-generator";
import { FileMappingCollectionEditor } from "../../Collections/FileMappingCollectionEditor.js";
import { ComponentCategory } from "../../Components/ComponentCategory.js";
import { ComponentCollection } from "../../Components/ComponentCollection.js";
import { FileMapping } from "../../Components/FileManagement/FileMapping.js";
import { IFileMapping } from "../../Components/FileManagement/IFileMapping.js";
import { IComponentCollection } from "../../Components/IComponentCollection.js";
import { BaseGeneratorFactory } from "../../Extensibility/BaseGeneratorFactory.js";
import { Generator } from "../../Generator.js";
import { GeneratorConstructor } from "../../GeneratorConstructor.js";

/**
 * Registers tests for the {@link BaseGeneratorFactory `BaseGeneratorFactory`} class.
 *
 * @param context
 * The test-context.
 */
export function BaseGeneratorFactoryTests(context: TestContext<TestGenerator>): void
{
    suite(
        nameof(BaseGeneratorFactory),
        () =>
        {
            /**
             * A class for testing.
             */
            class SuperGenerator extends TestGenerator<ITestGeneratorSettings>
            {
                /**
                 * @inheritdoc
                 */
                public override get TemplateRoot(): string
                {
                    return superTemplateDir;
                }

                /**
                 * @inheritdoc
                 */
                public override get Components(): IComponentCollection<any, any>
                {
                    return {
                        Question: "Choose the components!",
                        Categories: [
                            {
                                DisplayName: categoryName,
                                Components: [
                                    {
                                        ID: superComponentID,
                                        DisplayName: "",
                                        FileMappings: [
                                            {
                                                Source: superSourceFile,
                                                Destination: destinationFile
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };
                }

                /**
                 * @inheritdoc
                 */
                public override get FileMappings(): Array<IFileMapping<any, any>>
                {
                    return [
                        {
                            Source: superSourceFile,
                            Destination: destinationFile
                        }
                    ];
                }
            }

            /**
             * A class for testing.
             */
            class SubGenerator extends BaseGeneratorFactory.Create(SuperGenerator)
            {
                /**
                 * @inheritdoc
                 */
                public override get Base(): TestGenerator<ITestGeneratorSettings>
                {
                    return super.Base;
                }

                /**
                 * @inheritdoc
                 */
                public override get TemplateRoot(): string
                {
                    return subTemplateDir;
                }

                /**
                 * @inheritdoc
                 */
                public override get FileMappings(): Array<IFileMapping<any, any>>
                {
                    let result = super.FileMappings;

                    result.push(
                        {
                            Source: subSourceFile,
                            Destination: destinationFile
                        });

                    return result;
                }

                /**
                 * @inheritdoc
                 */
                public override get Components(): IComponentCollection<any, any>
                {
                    let result = super.Components;

                    for (let category of result.Categories)
                    {
                        if (category.DisplayName === categoryName)
                        {
                            category.Components.push(
                                {
                                    ID: subComponentID,
                                    DisplayName: "",
                                    FileMappings: [
                                        {
                                            Source: subSourceFile,
                                            Destination: destinationFile
                                        }
                                    ]
                                });
                        }
                    }

                    return result;
                }

                /**
                 * @inheritdoc
                 */
                public override get BaseFileMappings(): FileMappingCollectionEditor
                {
                    let result = super.BaseFileMappings;

                    result.Add(
                        {
                            Source: injectedSourceFile,
                            Destination: destinationFile
                        });

                    return result;
                }

                /**
                 * @inheritdoc
                 */
                public override get BaseComponents(): ComponentCollection<any, any>
                {
                    let result = super.BaseComponents;

                    result.Categories.Replace(
                        (category: ComponentCategory<any, any>) =>
                        {
                            return category.DisplayName === categoryName;
                        },
                        (category) =>
                        {
                            category.Components.Add(
                                {
                                    ID: injectedComponentID,
                                    DisplayName: "",
                                    FileMappings: [
                                        {
                                            Source: injectedSourceFile,
                                            Destination: destinationFile
                                        }
                                    ]
                                });

                            return category;
                        });

                    return result;
                }
            }

            /**
             * A component for checking a file-mapping.
             */
            type FileMappingCondition = (fileMapping: FileMapping<any, any>) => boolean;

            /**
             * Asserts the truthiness of the specified {@link condition `condition`}.
             *
             * @param fileMappings
             * The file-mappings to check.
             *
             * @param condition
             * The condition to check.
             *
             * @param all
             * A value indicating whether all or only one file-mapping is expected to match the {@link condition `condition`}.
             *
             * @returns
             * A value indicating whether the assertion is true.
             */
            function AssertFileMappings(fileMappings: Array<FileMapping<any, any>>, condition: FileMappingCondition, all = false): boolean
            {
                let values = fileMappings.map(
                    (fileMapping) => condition(fileMapping));

                return all ? values.every((value) => value) : values.some((value) => value);
            }

            /**
             * Asserts the truthiness of the specified {@link condition `condition`}.
             *
             * @param collection
             * The collection to check.
             *
             * @param condition
             * The condition to check.
             *
             * @param all
             * A value indicating whether all or only one file-mapping is expected to match the {@link condition `condition`}.
             *
             * @returns
             * A value indicating whether the assertion is true.
             */
            function AssertComponentFileMappings(collection: ComponentCollection<any, any>, condition: FileMappingCondition, all = false): boolean
            {
                let values = collection.Categories.Items.flatMap(
                    (category) =>
                    {
                        return category.Components.Items.map((component) => AssertFileMappings(component.FileMappings.Items, condition, all));
                    });

                return all ? values.every((value) => value) : values.some((value) => value);
            }

            let superTemplateDir: string;
            let subTemplateDir: string;
            let superSourceFile: string;
            let subSourceFile: string;
            let injectedSourceFile: string;
            let destinationFile: string;
            let categoryName: string;
            let superComponentID: string;
            let subComponentID: string;
            let injectedComponentID: string;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    await context.Generator;
                    superTemplateDir = context.RandomString + "1";
                    subTemplateDir = context.RandomString + "2";
                    superSourceFile = context.RandomString + "1";
                    subSourceFile = context.RandomString + "2";
                    injectedSourceFile = context.RandomString + "3";
                    destinationFile = context.RandomString + "4";
                    categoryName = context.RandomString;
                    superComponentID = context.RandomString + "1";
                    subComponentID = context.RandomString + "2";
                    injectedComponentID = context.RandomString + "3";
                });

            suite(
                nameof<BaseGeneratorFactory<any>>((factory) => factory.Create),
                () =>
                {
                    let generator: SubGenerator;
                    let externalGenerator: SubGenerator;

                    suiteSetup(
                        async function()
                        {
                            generator = context.CreateGenerator(SubGenerator);
                            generator.Base.moduleRoot(generator.Base.moduleRoot(context.RandomString));

                            /**
                             * A generator for testing.
                             */
                            class MyGenerator extends Generator.ComposeWith<GeneratorConstructor<TestGenerator<ITestGeneratorSettings>>>(TestGenerator, TestGenerator.Path)
                            {
                                /**
                                 * @inheritdoc
                                 */
                                public override get Base(): TestGenerator<ITestGeneratorSettings>
                                {
                                    return super.Base;
                                }

                                /**
                                 * @inheritdoc
                                 */
                                public override get BaseFileMappings(): FileMappingCollectionEditor
                                {
                                    return super.BaseFileMappings;
                                }

                                /**
                                 * @inheritdoc
                                 */
                                public override get BaseComponents(): ComponentCollection<any, any>
                                {
                                    return super.BaseComponents;
                                }
                            }

                            externalGenerator = context.CreateGenerator(MyGenerator);
                        });

                    test(
                        `Checking whether the generated \`${nameof(Generator.constructor)}\` inherits the desired class…`,
                        () =>
                        {
                            ok(context.CreateGenerator(BaseGeneratorFactory.Create(TestGenerator)) instanceof TestGenerator);
                        });

                    test(
                        `Checking whether the value of \`${nameof<Generator>()}.${nameof<Generator>((g) => g.resolved)}\` while creating a base-generator…`,
                        () =>
                        {
                            /**
                             * Provides a generator-class for testing.
                             */
                            class Test extends Generator<any> { }

                            let testValue = context.RandomString;
                            BaseGeneratorFactory.Create(Test, `${testValue}${context.RandomString}`);
                            ok(!(nameof<Generator>((generator) => generator.resolved) in Test));
                            (Test as any)[nameof<Generator>((generator) => generator.resolved)] = testValue;
                            BaseGeneratorFactory.Create(Test, `${testValue}${context.RandomString}`);
                            strictEqual((Test as any)[nameof<Generator>((generator) => generator.resolved)], testValue);
                        });

                    test(
                        "Checking whether the settings-object is the same for both the base and the inheriting generator…",
                        () =>
                        {
                            let key = context.RandomString;
                            strictEqual(generator.Settings, generator.Base.Settings);
                            generator.Settings[key] = context.RandomString;
                            strictEqual(generator.Settings[key], generator.Base.Settings[key]);
                        });

                    test(
                        "Checking whether a base generator is created as expected…",
                        () =>
                        {
                            ok(generator.Base instanceof SuperGenerator);
                        });

                    test(
                        "Checking whether template-paths of both the generator and its base-generator are set properly…",
                        () =>
                        {
                            notStrictEqual(generator.templatePath(), generator.Base.templatePath());
                            strictEqual(generator.templatePath(), generator.commonTemplatePath(subTemplateDir));
                            strictEqual(generator.Base.templatePath(), generator.Base.commonTemplatePath(superTemplateDir));
                        });

                    test(
                        "Checking whether destination-paths are created the same way for file-mappings and components of the base and the inheriting generator…",
                        async () =>
                        {
                            let condition: FileMappingCondition = (fileMapping) =>
                                fileMapping.Destination === generator.destinationPath(destinationFile);

                            ok(AssertFileMappings(generator.FileMappingCollection.Items, condition, true));
                            ok(AssertComponentFileMappings(generator.ComponentCollection, condition, true));
                        });

                    test(
                        "Checking whether file-mappings of the base-generator persist in the inheriting generator…",
                        async () =>
                        {
                            ok(
                                AssertFileMappings(
                                    generator.FileMappingCollection.Items,
                                    (fileMapping) => fileMapping.Source === generator.Base.templatePath(superSourceFile)));
                        });

                    test(
                        "Checking whether components of the base-generator persist in the inheriting generator…",
                        async () =>
                        {
                            ok(
                                generator.ComponentCollection.Categories.Items.some(
                                    (category) => category.Components.Items.some(
                                        (component) => component.ID === superComponentID)));

                            ok(
                                AssertComponentFileMappings(
                                    generator.ComponentCollection,
                                    (fileMapping) =>
                                    {
                                        return fileMapping.Source === generator.Base.templatePath(superSourceFile);
                                    }));
                        });

                    test(
                        "Checking whether components can be added to existing categories as expected…",
                        async () =>
                        {
                            strictEqual(
                                generator.ComponentCollection.Categories.Items.filter(
                                    (category) => category.DisplayName === categoryName).length,
                                1);
                        });

                    test(
                        "Checking whether file-mappings of the inheriting generator are present…",
                        async () =>
                        {
                            ok(
                                AssertFileMappings(
                                    generator.FileMappingCollection.Items,
                                    (fileMapping) => fileMapping.Source === generator.Base.templatePath(superSourceFile)));
                        });

                    test(
                        "Checking whether components of the inheriting generator are present…",
                        async () =>
                        {
                            ok(
                                generator.ComponentCollection.Categories.Items.some(
                                    (category) => category.Components.Items.some(
                                        (component) => component.ID === subComponentID)));

                            ok(
                                AssertComponentFileMappings(
                                    generator.ComponentCollection,
                                    (fileMapping) => fileMapping.Source === generator.templatePath(subSourceFile)));
                        });

                    test(
                        "Checking whether the file-mappings of the base can be injected…",
                        async () =>
                        {
                            ok(
                                AssertFileMappings(
                                    generator.FileMappingCollection.Items,
                                    (fileMapping) => fileMapping.Source === generator.Base.templatePath(injectedSourceFile)));
                        });

                    test(
                        "Checking whether the components of the base can be injected…",
                        async () =>
                        {
                            ok(
                                AssertComponentFileMappings(
                                    generator.ComponentCollection,
                                    (fileMapping) => fileMapping.Source === generator.Base.templatePath(injectedSourceFile)));
                        });

                    test(
                        "Checking whether the module-path of the base resolves to its package…",
                        async () =>
                        {
                            strictEqual(externalGenerator.Base.modulePath(), (await context.Generator).modulePath());
                        });

                    test(
                        "Checking whether the module-path of the generator is not affected by the module-path of the base…",
                        () =>
                        {
                            notStrictEqual(externalGenerator.modulePath(), externalGenerator.Base.modulePath());
                        });

                    test(
                        "Checking whether the base-generator is created using the constructor rather than the namespace (or path)…",
                        () =>
                        {
                            let testGenerator = context.CreateGenerator(class extends Generator.ComposeWith(class extends Generator { }, TestGenerator.Path) { });
                            ok(!(testGenerator instanceof TestGenerator));
                            ok(testGenerator instanceof Generator);
                        });

                    test(
                        `Checking whether generators with \`${nameof<GeneratorOptions>((o) => o.customPriorities)}\` can be used correctly…`,
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    context.CreateGenerator(
                                        class extends Generator.ComposeWith(
                                            class extends Generator
                                            {
                                                /**
                                                 * Initializes a new instance of the class.
                                                 *
                                                 * @param args
                                                 * A set of arguments for the generator.
                                                 *
                                                 * @param options
                                                 * A set of options for the generator.
                                                 */
                                                public constructor(args: string | string[], options: GeneratorOptions)
                                                {
                                                    super(
                                                        args,
                                                        {
                                                            ...options,
                                                            customPriorities: [
                                                                ...(options.customPriorities ?? []),
                                                                {
                                                                    before: "end",
                                                                    priorityName: "test"
                                                                }
                                                            ]
                                                        });
                                                }
                                            },
                                            TestGenerator.Path)
                                        { });
                                });
                        });

                    test(
                        "Checking whether the file-mappings and the components of the base-generator are resolved correctly when creating multiple instances…",
                        function()
                        {
                            this.slow(1 * 1000);
                            this.timeout(2 * 1000);
                            generator = context.CreateGenerator(SubGenerator);
                            context.CreateGenerator(SubGenerator);
                            strictEqual(generator.BaseComponents.Generator, generator.Base);
                            deepStrictEqual(generator.BaseComponents.Object, generator.Base.ComponentCollection.Object);
                            strictEqual(generator.BaseFileMappings.Generator, generator.Base);

                            deepStrictEqual(
                                generator.BaseFileMappings.Items.map((item) => item.Object),
                                generator.Base.ResolvedFileMappings.Items.map((item) => item.Object));
                        });
                });
        });
}
