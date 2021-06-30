import { doesNotThrow } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { ComponentOptionCollection } from "../../Collections/ComponentOptionCollection";
import { Component } from "../../Components/Component";
import { IComponent } from "../../Components/IComponent";
import { Generator } from "../../Generator";

/**
 * Registers tests for the {@link ComponentOptionCollection `ComponentOptionCollection`} class.
 *
 * @param context
 * The test-context.
 */
export function ComponentOptionCollectionTests(context: TestContext): void
{
    suite(
        nameof(ComponentOptionCollection),
        () =>
        {
            let random: Random;
            let generator: Generator;
            let collection: ComponentOptionCollection;

            suiteSetup(
                async () =>
                {
                    random = new Random();
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    collection = new ComponentOptionCollection(generator, []);
                });

            suite(
                nameof<ComponentOptionCollection>((collection) => collection.Add),
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
