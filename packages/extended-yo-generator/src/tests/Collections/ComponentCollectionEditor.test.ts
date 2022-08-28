import { doesNotThrow } from "node:assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ComponentCollectionEditor } from "../../Collections/ComponentCollectionEditor.js";
import { Component } from "../../Components/Component.js";
import { IComponent } from "../../Components/IComponent.js";
import { Generator } from "../../Generator.js";

/**
 * Registers tests for the {@link ComponentOptionCollection `ComponentOptionCollection`} class.
 *
 * @param context
 * The test-context.
 */
export function ComponentCollectionEditorTests(context: TestContext): void
{
    suite(
        nameof(ComponentCollectionEditor),
        () =>
        {
            let generator: Generator;
            let collection: ComponentCollectionEditor;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    collection = new ComponentCollectionEditor(generator, []);
                });

            suite(
                nameof<ComponentCollectionEditor>((collection) => collection.Add),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<Component<any, any>>()}\`s are created correctly…`,
                        () =>
                        {
                            let component: IComponent<any, any> = {
                                ID: context.RandomString,
                                DisplayName: "",
                                FileMappings: []
                            };

                            collection.Add(component);
                            doesNotThrow(() => collection.Get(component.ID));
                        });
                });
        });
}
