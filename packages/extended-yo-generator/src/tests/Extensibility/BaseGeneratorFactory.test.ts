import { notStrictEqual, ok, strictEqual } from "assert";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import Environment = require("yeoman-environment");
import { FileMappingOptionCollection } from "../../Collections/FileMappingOptionCollection";
import { ComponentCollection } from "../../Components/ComponentCollection";
import { FileMapping } from "../../Components/FileManagement/FileMapping";
import { IFileMapping } from "../../Components/FileManagement/IFileMapping";
import { IComponentCollection } from "../../Components/IComponentCollection";
import { BaseGeneratorFactory } from "../../Extensibility/BaseGeneratorFactory";
import { Generator } from "../../Generator";

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

            /**
             * A class for testing.
             */
            class SuperGenerator extends TestGenerator
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
                public override get BaseFileMappings(): FileMappingOptionCollection
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

                    for (let category of result.Categories)
                    {
                        if (category.DisplayName === categoryName)
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
                        }
                    }

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
                let values = collection.Categories.flatMap(
                    (category) =>
                    {
                        return category.Components.map((component) => AssertFileMappings(component.FileMappings, condition, all));
                    });

                return all ? values.every((value) => value) : values.some((value) => value);
            }

            /**
             * Initializes a new instance of the specified generator-constructor.
             *
             * @template T
             * The type of the generator to create.
             *
             * @param generatorConstructor
             * The constructor of the generator to instantiate.
             *
             * @returns
             * The newly initialized generator.
             */
            function CreateGenerator<T extends Generator>(generatorConstructor: new (...args: any[]) => T): T
            {
                return new generatorConstructor([], { env: Environment.createEnv() });
            }

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
                });

            suite(
                "Testing Basic Usage",
                () =>
                {
                    let generator: SubGenerator;

                    suiteSetup(
                        async function()
                        {
                            generator = CreateGenerator(SubGenerator);
                            generator.Base.moduleRoot(generator.Base.moduleRoot(context.RandomString));
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
                        "Checking whether a base generator is created…",
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
                                generator.ComponentCollection.Categories.some(
                                    (category) => category.Components.some(
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
                                generator.ComponentCollection.Categories.filter(
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
                                generator.ComponentCollection.Categories.some(
                                    (category) => category.Components.some(
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
                });

            suite(
                "Testing Usage With External Base-Generators",
                () =>
                {
                    let generator: SubGenerator;

                    suiteSetup(
                        async function()
                        {
                            this.timeout(0);

                            /**
                             * A generator for testing.
                             */
                            class MyGenerator extends Generator.ComposeWith(TestGenerator, TestGenerator.Path)
                            { }

                            generator = CreateGenerator(MyGenerator);
                        });

                    test(
                        "Checking whether the module-path of the base resolves to its package…",
                        async () =>
                        {
                            strictEqual(generator.Base.modulePath(), (await context.Generator).modulePath());
                        });

                    test(
                        "Checking whether the module-path of the generator is not affected by the module-path of the package…",
                        () =>
                        {
                            notStrictEqual(generator.modulePath(), generator.Base.modulePath());
                        });

                    test(
                        "Checking whether the base-generator is created using the constructor rather than the namespace (or path)…",
                        () =>
                        {
                            let testGenerator = CreateGenerator(class extends Generator.ComposeWith(class extends Generator { }, TestGenerator.Path) { });
                            ok(!(testGenerator instanceof TestGenerator));
                            ok(testGenerator instanceof Generator);
                        });
                });
        });
}
