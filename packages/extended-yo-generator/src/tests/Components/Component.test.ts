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
        nameof(Component),
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
                async function()
                {
                    this.timeout(30 * 1000);
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
                nameof<Component<any, any>>((component) => component.ID),
                () =>
                {
                    test(
                        "Checking whether the value can be set…",
                        () =>
                        {
                            let value = context.RandomString;
                            component.ID = value;
                            strictEqual(componentOptions.ID, value);
                        });
                });

            suite(
                nameof<Component<any, any>>((component) => component.DisplayName),
                () =>
                {
                    test(
                        "Checking whether the value can be set…",
                        () =>
                        {
                            let value = context.RandomString;
                            component.DisplayName = value;
                            strictEqual(componentOptions.DisplayName, value);
                        });
                });

            suite(
                nameof<Component<any, any>>((component) => component.DefaultEnabled),
                () =>
                {
                    test(
                        "Checking whether the value can be set…",
                        () =>
                        {
                            let value = context.Random.bool();
                            component.DefaultEnabled = value;
                            strictEqual(componentOptions.DefaultEnabled, value);
                        });
                });

            suite(
                nameof<Component<any, any>>((component) => component.FileMappings),
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
                        `Checking whether changes made to the \`${nameof<Component<any, any>>((c) => c.FileMappings)}\` option immediately take effect until the property has been queried the first time…`,
                        async () =>
                        {
                            componentOptions.FileMappings = [
                                {
                                    Destination: testFile.FullName
                                }
                            ];

                            strictEqual(component.FileMappings.Items[0].Destination, testFile.FullName);
                        });
                });
        });
}
