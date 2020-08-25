import Assert = require("assert");
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ComponentCollection } from "../../Components/ComponentCollection";
import { FileMapping } from "../../Components/FileMapping";
import { IComponentCollection } from "../../Components/IComponentCollection";
import { IFileMapping } from "../../Components/IFileMapping";
import { ResolveValue } from "../../Components/Resolving/ResolveValue";
import { Generator } from "../../Generator";

/**
 * Registers tests for the `BaseConstructorCreator` class.
 *
 * @param context
 * The test-context.
 */
export function BaseConstructorCreatorTests(context: TestContext<TestGenerator>): void
{
    suite(
        "BaseConstructorCreator",
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
                public get TemplateRoot(): string
                {
                    return superTemplateDir;
                }

                /**
                 * @inheritdoc
                 */
                public get Components(): IComponentCollection<any, any>
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
                public get FileMappings(): ResolveValue<Array<IFileMapping<any, any>>>
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
            class SubGenerator extends Generator.ComposeWith(SuperGenerator)
            {
                /**
                 * @inheritdoc
                 */
                public get TemplateRoot(): string
                {
                    return subTemplateDir;
                }

                /**
                 * @inheritdoc
                 */
                public get FileMappings(): ResolveValue<Array<IFileMapping<any, any>>>
                {
                    let fileMappingTask = super.FileMappings;

                    return (
                        async () =>
                        {
                            let result = await fileMappingTask;

                            result.push(
                                {
                                    Source: subSourceFile,
                                    Destination: destinationFile
                                });

                            return result;
                        })();
                }

                /**
                 * @inheritdoc
                 */
                public get Components(): IComponentCollection<any, any>
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
                public get BaseFileMappings(): ResolveValue<Array<IFileMapping<any, any>>>
                {
                    let fileMappingTask = super.BaseFileMappings;

                    return (
                        async () =>
                        {
                            let result = await fileMappingTask;

                            result.push(
                                {
                                    Source: injectedSourceFile,
                                    Destination: destinationFile
                                });

                            return result;
                        })();
                }

                /**
                 * @inheritdoc
                 */
                public get BaseComponents(): IComponentCollection<any, any>
                {
                    let result = super.BaseComponents;

                    for (let category of result.Categories)
                    {
                        if (category.DisplayName === categoryName)
                        {
                            category.Components.push(
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
            type FileMappingCondition = (fileMapping: FileMapping<any, any>) => Promise<boolean>;

            /**
             * Asserts the truthyness of the specified `condition`.
             *
             * @param fileMappings
             * The file-mappings to check.
             *
             * @param condition
             * The condition to check.
             *
             * @param all
             * A value indicating whether all or only one file-mapping is expected to match the `condition`.
             *
             * @returns
             * A value indicating whether the assertion is true.
             */
            async function AssertFileMappings(fileMappings: Array<FileMapping<any, any>>, condition: FileMappingCondition, all = false): Promise<boolean>
            {
                let values = (await Promise.all(
                    fileMappings.map(
                        async (fileMapping) => condition(fileMapping))));

                return all ? values.every((value) => value) : values.some((value) => value);
            }

            /**
             * Asserts the truthyness of the specified `condition`.
             *
             * @param collection
             * The collection to check.
             *
             * @param condition
             * The condition to check.
             *
             * @param all
             * A value indicating whether all or only one file-mapping is expected to match the `condition`.
             *
             * @returns
             * A value indicating whether the assertion is true.
             */
            async function AssertComponentFileMappings(collection: ComponentCollection<any, any>, condition: FileMappingCondition, all = false): Promise<boolean>
            {
                let values = await Promise.all(collection.Categories.flatMap(
                    (category) =>
                    {
                        return category.Components.map(async (component) => AssertFileMappings(await component.FileMappings, condition, all));
                    }));

                return all ? values.every((value) => value) : values.some((value) => value);
            }

            suiteSetup(
                () =>
                {
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
                            generator = new SubGenerator([], {} as any);
                            generator.Base.moduleRoot(generator.Base.moduleRoot(context.RandomString));
                        });

                    test(
                        "Checking whether the settings-object is the same for both the base and the inheriting generator…",
                        () =>
                        {
                            let key = context.RandomString;
                            Assert.strictEqual(generator.Settings, generator.Base.Settings);
                            generator.Settings[key] = context.RandomString;
                            Assert.strictEqual(generator.Settings[key], generator.Base.Settings[key]);
                        });

                    test(
                        "Checking whether a base generator is created…",
                        () =>
                        {
                            Assert.ok(generator.Base instanceof SuperGenerator);
                        });

                    test(
                        "Checking whether template-paths of both the generator and its base-generator are set properly…",
                        () =>
                        {
                            Assert.notStrictEqual(generator.templatePath(), generator.Base.templatePath());
                            Assert.strictEqual(generator.templatePath(), generator.commonTemplatePath(subTemplateDir));
                            Assert.strictEqual(generator.Base.templatePath(), generator.Base.commonTemplatePath(superTemplateDir));
                        });

                    test(
                        "Checking whether destination-paths are created the same way for file-mappings and components of the base and the inheriting generator…",
                        async () =>
                        {
                            let condition: FileMappingCondition = async (fileMapping) =>
                                await fileMapping.Destination === generator.destinationPath(destinationFile);

                            Assert.ok(await AssertFileMappings(await generator.FileMappingCollection, condition, true));
                            Assert.ok(await AssertComponentFileMappings(generator.ComponentCollection, condition, true));
                        });

                    test(
                        "Checking whether file-mappings of the base-generator presist in the inheriting generator…",
                        async () =>
                        {
                            Assert.ok(
                                await AssertFileMappings(
                                    await generator.FileMappingCollection,
                                    async (fileMapping) => await fileMapping.Source === generator.Base.templatePath(superSourceFile)));
                        });

                    test(
                        "Checking whether components of the base-generator presist in the inheriting generator…",
                        async () =>
                        {
                            Assert.ok(
                                generator.ComponentCollection.Categories.some(
                                    (category) => category.Components.some(
                                        (component) => component.ID === superComponentID)));

                            Assert.ok(
                                await AssertComponentFileMappings(
                                    generator.ComponentCollection,
                                    async (fileMapping) =>
                                    {
                                        return await fileMapping.Source === generator.Base.templatePath(superSourceFile);
                                    }));
                        });

                    test(
                        "Checking whether components can be added to existing categories as expected…",
                        async () =>
                        {
                            Assert.strictEqual(
                                generator.ComponentCollection.Categories.filter(
                                    (category) => category.DisplayName === categoryName).length, 1);
                        });

                    test(
                        "Checking whether file-mappings of the inheriting generator are present…",
                        async () =>
                        {
                            Assert.ok(
                                await AssertFileMappings(
                                    await generator.FileMappingCollection,
                                    async (fileMapping) => await fileMapping.Source === generator.Base.templatePath(superSourceFile)));
                        });

                    test(
                        "Checking whether components of the inheriting generator are present…",
                        async () =>
                        {
                            Assert.ok(
                                generator.ComponentCollection.Categories.some(
                                    (category) => category.Components.some(
                                        (component) => component.ID === subComponentID)));

                            Assert.ok(
                                await AssertComponentFileMappings(
                                    generator.ComponentCollection,
                                    async (fileMapping) => await fileMapping.Source === generator.templatePath(subSourceFile)));
                        });

                    test(
                        "Checking whether the file-mappings of the base can be injected…",
                        async () =>
                        {
                            Assert.ok(
                                await AssertFileMappings(
                                    await generator.FileMappingCollection,
                                    async (fileMapping) => await fileMapping.Source === generator.Base.templatePath(injectedSourceFile)));
                        });

                    test(
                        "Checking whether the components of the base can be injected…",
                        async () =>
                        {
                            Assert.ok(
                                await AssertComponentFileMappings(
                                    generator.ComponentCollection,
                                    async (fileMapping) => await fileMapping.Source === generator.Base.templatePath(injectedSourceFile)));
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

                            generator = new MyGenerator([], {} as any);
                        });

                    test(
                        "Checking whether the module-path of the base resolves to its package…",
                        async () =>
                        {
                            Assert.strictEqual(generator.Base.modulePath(), (await context.Generator).modulePath());
                        });

                    test(
                        "Checking whether the module-path of the generator is not affected by the module-path of the package…",
                        () =>
                        {
                            Assert.notStrictEqual(generator.modulePath(), generator.Base.modulePath());
                        });

                    test(
                        "Checking whether the base-generator is created using the constructor rather than the namespace (or path)…",
                        () =>
                        {
                            let testGenerator = new class extends Generator.ComposeWith(class extends Generator { }, TestGenerator.Path)
                            { }([], {} as any);

                            Assert.ok(!(testGenerator instanceof TestGenerator));
                            Assert.ok(testGenerator instanceof Generator);
                        });
                });
        });
}
