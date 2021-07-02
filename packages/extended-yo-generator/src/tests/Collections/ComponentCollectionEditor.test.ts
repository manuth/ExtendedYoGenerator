import { doesNotThrow } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { ComponentCollectionEditor } from "../../Collections/ComponentCollectionEditor";
import { Component } from "../../Components/Component";
import { IComponent } from "../../Components/IComponent";
import { Generator } from "../../Generator";

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
            let random: Random;
            let generator: Generator;
            let collection: ComponentCollectionEditor;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    random = new Random();
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
                                ID: random.string(10),
                                DisplayName: "",
                                FileMappings: []
                            };

                            collection.Add(component);
                            doesNotThrow(() => collection.Get(component.ID));
                        });
                });
        });
}
