import Assert = require("assert");
import { TestContext, TestGenerator, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions } from "@manuth/extended-yo-generator-test";
import { TempFile } from "temp-filesystem";
import { Component } from "../../Components/Component";
import { IComponent } from "../../Components/IComponent";
import { IFileMapping } from "../../Components/IFileMapping";

/**
 * Provides tests for the `Component` class.
 *
 * @param context
 * The context to use.
 */
export function ComponentTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Component",
        () =>
        {
            let generator: TestGenerator;
            let component: Component<ITestGeneratorSettings>;

            let componentOptions: IComponent<ITestGeneratorSettings> = {
                ID: null,
                DisplayName: null,
                FileMappings: []
            };

            suiteSetup(
                async () =>
                {
                    generator = await context.Generator;
                    component = new Component(generator, componentOptions);
                });

            setup(
                () =>
                {
                    componentOptions.ID = null;
                    componentOptions.DisplayName = null;
                    componentOptions.DefaultEnabled = false;
                    componentOptions.Questions = [];
                    componentOptions.FileMappings = [];
                });

            suite(
                "Promise<Array<FileMapping<TSettings>>> FileMappings",
                () =>
                {
                    let testFile: TempFile;

                    suiteSetup(
                        () =>
                        {
                            testFile = new TempFile();
                        });

                    suiteTeardown(
                        () =>
                        {
                            testFile.Dispose();
                        });

                    test(
                        "Checking whether changes to the `FileMappings` option immediately take affect…",
                        async () =>
                        {
                            componentOptions.FileMappings = context.CreatePromiseFunction<Array<IFileMapping<ITestGeneratorSettings>>>(
                                [
                                    {
                                        Destination: context.CreateFunction(testFile.FullName)
                                    }
                                ]);

                            Assert.strictEqual(await (await component.FileMappings)[0].Destination, testFile.FullName);
                        });
                });
        });
}
