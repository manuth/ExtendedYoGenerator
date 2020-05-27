import Assert = require("assert");
import FileSystem = require("fs-extra");
import Path = require("upath");
import { isNullOrUndefined } from "util";
import { run, RunContext } from "yeoman-test";
import { GeneratorSetting } from "..";
import { TestGenerator } from "./TestGenerator";
import { TestContext } from "./TestContext";
import { IRunContext } from "./IRunContext";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions";

/**
 * Registers the generator-tests.
 *
 * @param context
 * The context to use.
 */
export function GeneratorTests(context: TestContext)
{
    suite(
        "Generator",
        () =>
        {
            let generator: TestGenerator;

            let generatorOptions: ITestGeneratorOptions = {
                TemplateRoot: "test",
                Questions: [
                    {
                        name: "test",
                        message: "test",
                        default: "test"
                    }
                ],
                Components: {
                    Question: "test",
                    Categories: [
                        {
                            DisplayName: "test",
                            Components: [
                                {
                                    ID: "test1",
                                    DisplayName: "Test 1",
                                    FileMappings: [],
                                    DefaultEnabled: true,
                                    Questions: [
                                        {
                                            name: "additional1",
                                            default: "test"
                                        }
                                    ]
                                },
                                {
                                    ID: "test2",
                                    DisplayName: "Test 2",
                                    FileMappings: [],
                                    DefaultEnabled: false,
                                    Questions: [
                                        {
                                            name: "additional2",
                                            default: "test"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };

            /**
             * Asserts a file-path.
             *
             * @param actual
             * The actual path.
             *
             * @param expected
             * The expected path.
             */
            function AssertPath(actual: string, expected: string)
            {
                Assert.strictEqual(ProcessPath(actual), ProcessPath(expected));
            }

            /**
             * Resolves and normalizes a path for better comparsion.
             *
             * @param path
             * The path to process.
             */
            function ProcessPath(path: string)
            {
                return Path.normalize(Path.resolve(path));
            }

            suiteSetup(
                async () =>
                {
                    runContext = context.ExecuteGenerator({ testGeneratorOptions: generatorOptions });
                    await runContext.toPromise();
                    generator = runContext.generator;
                });

            suite(
                "General",
                () =>
                {
                    test(
                        "Checking whether the generator can be executed…",
                        async function ()
                        {
                            this.enableTimeouts(false);
                        });
                });

            suite(
                "modulePath(...path)",
                () =>
                {
                    test(
                        "Checking whether `modulePath(...path)` resolves to the root of the generator's module…",
                        () =>
                        {
                            AssertPath(generator.modulePath(testPath), Path.join(context.GeneratorDirectory, testPath));
                        });
                });

            suite(
                "templatePath(...path)",
                () =>
                {
                    suite(
                        "Checking whether `templatePath(...path)` resolves correctly…",
                        () =>
                        {
                            test(
                                "Checking whether the template-path is a sub-directory of the module…",
                                () =>
                                {
                                    let relativePath = Path.relative(ProcessPath(Path.join(context.GeneratorDirectory)), ProcessPath(generator.templatePath(testPath)));
                                    console.log(generator, generatorOptions);
                                    Assert.ok(!Path.isAbsolute(relativePath));
                                    Assert.ok(!relativePath.startsWith(".."));
                                });

                            test(
                                "Checking whether the template-path ends with the name of the `TemplateRoot`…",
                                () =>
                                {
                                    Assert.strictEqual(Path.basename(generator.templatePath()), generator.TemplateRoot);
                                });
                        });
                });

            suite(
                "Components",
                () =>
                {
                    test(
                        "Checking whether the default components are selected by default…",
                        () =>
                        {
                            if (!isNullOrUndefined(generator.Components))
                            {
                                for (let category of generator.Components.Categories)
                                {
                                    for (let component of category.Components)
                                    {
                                        if (component.DefaultEnabled)
                                        {
                                            Assert.strictEqual(generator.Settings[GeneratorSetting.Components].includes(component.ID), true);
                                        }
                                    }
                                }
                            }
                        });

                    test(
                        "Checking whether additional questions are asked, if components are selected…",
                        () =>
                        {
                            if (!isNullOrUndefined(generator.Components))
                            {
                                for (let category of generator.Components.Categories)
                                {
                                    for (let component of category.Components)
                                    {
                                        if (!isNullOrUndefined(component.Questions))
                                        {
                                            for (let question of component.Questions)
                                            {
                                                Assert.strictEqual(
                                                    question.name in generator.Settings,
                                                    generator.Settings[GeneratorSetting.Components].includes(component.ID));
                                            }
                                        }
                                    }
                                }
                            }
                        });
                });

            suite(
                "Questions",
                () =>
                {
                    test(
                        "Checking whether the `Questions` are asked…",
                        () =>
                        {
                            for (let question of generator.Questions)
                            {
                                if (!isNullOrUndefined(question.default))
                                {
                                    Assert.strictEqual(question.name in generator.Settings, true);
                                }
                            }
                        });
                });
        });
}
