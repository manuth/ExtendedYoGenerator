import Assert = require("assert");
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { IFileMapping } from "../../Components/IFileMapping";
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
                public get FileMappings(): Array<IFileMapping<any, any>>
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
                public get FileMappings(): Array<IFileMapping<any, any>>
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
                public get BaseFileMappings(): Array<IFileMapping<any, any>>
                {
                    let result = super.BaseFileMappings;

                    result.push(
                        {
                            Source: injectedSourceFile,
                            Destination: destinationFile
                        });

                    return result;
                }
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
                        "Checking whether auto-generated file-mapping paths resolve to the propper package…",
                        async () =>
                        {
                            Assert.ok(
                                (await Promise.all(
                                    generator.FileMappingCollection.map(
                                        async (fileMapping) => await fileMapping.Destination === generator.destinationPath(destinationFile)))).every(
                                            (value) => value));

                            Assert.ok(
                                (await Promise.all(
                                    generator.FileMappingCollection.map(
                                        async (fileMapping) => await fileMapping.Source === generator.templatePath(subSourceFile)))).some(
                                            (value) => value));

                            Assert.ok(
                                (await Promise.all(
                                    generator.FileMappingCollection.map(
                                        async (fileMapping) => await fileMapping.Source === generator.Base.templatePath(superSourceFile)))).some(
                                            (value) => value));
                        });

                    test(
                        "Checking whether the file-mappings of the base can be injected…",
                        () =>
                        {
                            Assert.ok(generator.Base.FileMappings.some((fileMapping) => fileMapping.Source === injectedSourceFile));
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
                });
        });
}
