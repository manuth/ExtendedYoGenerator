import Assert = require("assert");
import { TestContext } from "../TestContext";
import { IComponent } from "../../Components/IComponent";
import { IFileMapping } from "../../Components/IFileMapping";
import { Component } from "../../Components/Component";
import { TestGenerator } from "../TestGenerator";
import { TempFile } from "temp-filesystem";

/**
 * Provides tests for the `Component` class.
 *
 * @param context
 * The context to use.
 */
export function ComponentTests(context: TestContext)
{
    suite(
        "Component",
        () =>
        {
            let generator: TestGenerator;
            let component: Component<any>;

            let componentOptions: IComponent<any> = {
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
                            componentOptions.FileMappings = context.CreatePromiseFunction<IFileMapping<any>[]>(
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
