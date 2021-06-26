import { strictEqual } from "assert";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { Component } from "../../Components/Component";
import { IComponent } from "../../Components/IComponent";

/**
 * Provides tests for the {@link Component `Component<TSettings, TOptions>`} class.
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
            let component: Component<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>>;

            let componentOptions: IComponent<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>> = {
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
                "FileMappings",
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
                            componentOptions.FileMappings = [
                                {
                                    Destination: testFile.FullName
                                }
                            ];

                            strictEqual(component.FileMappings[0].Destination, testFile.FullName);
                        });
                });
        });
}
