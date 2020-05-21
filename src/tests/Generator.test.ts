import Assert = require("assert");
import FileSystem = require("fs-extra");
import Path = require("path");
import { isNullOrUndefined } from "util";
import { run, RunContext } from "yeoman-test";
import { Generator, GeneratorSetting } from "..";

suite(
    "Generator",
    () =>
    {
        let runContext: RunContext;
        let generatorDir: string;
        let generator: Generator;

        suiteSetup(
            async () =>
            {
                generatorDir = Path.join(__dirname, "TestGenerator");
                await FileSystem.writeJSON(
                    Path.join(generatorDir, "package.json"),
                    {
                        name: "test"
                    });
                runContext = run(generatorDir);
            });

        suite(
            "General",
            () =>
            {
                test(
                    "Checking whether the generator can be executed…",
                    async () =>
                    {
                        await runContext.toPromise();
                        generator = (runContext as any).generator;
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
                        Assert.strictEqual(Path.resolve(generator.modulePath()), Path.resolve(generatorDir));
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
                                Assert.strictEqual(generator.templatePath().startsWith(generator.modulePath()), true);
                            });

                        test(
                            "Checking whether the template-path ends with the name of the `TemplateRoot`…",
                            () =>
                            {
                                Assert.strictEqual(Path.basename(generator.templatePath()), generator["TemplateRoot"]);
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
                        if (!isNullOrUndefined(generator["Components"]))
                        {
                            for (let category of generator["Components"].Categories)
                            {
                                for (let component of category.Components)
                                {
                                    if (component.DefaultEnabled)
                                    {
                                        Assert.strictEqual(generator["Settings"][GeneratorSetting.Components].includes(component.ID), true);
                                    }
                                }
                            }
                        }
                    });

                test(
                    "Checking whether additional questions are asked, if components are selected…",
                    () =>
                    {
                        if (!isNullOrUndefined(generator["Components"]))
                        {
                            for (let category of generator["Components"].Categories)
                            {
                                for (let component of category.Components)
                                {
                                    if (!isNullOrUndefined(component.Questions))
                                    {
                                        for (let question of component.Questions)
                                        {
                                            Assert.strictEqual(
                                                question.name in generator["Settings"],
                                                generator["Settings"][GeneratorSetting.Components].includes(component.ID));
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
                        for (let question of generator["Questions"])
                        {
                            if (!isNullOrUndefined(question.default))
                            {
                                Assert.strictEqual(question.name in generator["Settings"], true);
                            }
                        }
                    });
            });
    });