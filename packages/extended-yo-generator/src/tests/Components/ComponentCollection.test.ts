import { ok, strictEqual } from "assert";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { CheckboxQuestion } from "inquirer";
import { Random } from "random-js";
import { Question } from "yeoman-environment";
import { Component } from "../../Components/Component";
import { ComponentCollection } from "../../Components/ComponentCollection";
import { IComponent } from "../../Components/IComponent";
import { IComponentCategory } from "../../Components/IComponentCategory";
import { IComponentCollection } from "../../Components/IComponentCollection";
import { GeneratorSettingKey } from "../../GeneratorSettingKey";
import { IGeneratorSettings } from "../../IGeneratorSettings";

/**
 * Provides tests for the {@link ComponentCollection `ComponentCollection<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function ComponentCollectionTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(ComponentCollection),
        () =>
        {
            /**
             * Provides an implementation of the {@link ComponentCollection `ComponentCollection<TSettings, TOptions>`} class for testing.
             */
            class MyComponentCollection extends ComponentCollection<any, any>
            {
                /**
                 * @inheritdoc
                 */
                public override get ComponentChoiceQuestion(): CheckboxQuestion<any>
                {
                    return super.ComponentChoiceQuestion;
                }

                /**
                 * @inheritdoc
                 */
                public override get ComponentQuestions(): Array<Question<any>>
                {
                    return super.ComponentQuestions;
                }
            }

            let random: Random;
            let generator: TestGenerator;
            let collection: MyComponentCollection;
            let randomString: Generator<string>;

            let collectionOptions: IComponentCollection<ITestGeneratorSettings, ITestGeneratorOptions<ITestOptions>> = {
                Question: null,
                Categories: []
            };

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    random = new Random();
                    generator = await context.Generator;
                    collection = new MyComponentCollection(generator, collectionOptions);
                });

            setup(
                () =>
                {
                    collectionOptions.Question = null;
                    collectionOptions.Categories = [];

                    randomString = function*()
                    {
                        let i = 1;

                        while (true)
                        {
                            yield random.string(i++);
                        }
                    }();

                    for (let i = random.integer(1, 5); i > 0; i--)
                    {
                        let category: IComponentCategory<any, any> = {
                            ID: randomString.next().value,
                            DisplayName: "",
                            Components: []
                        };

                        for (let i = random.integer(1, 5); i > 0; i--)
                        {
                            let component: IComponent<any, any> = {
                                ID: randomString.next().value,
                                DisplayName: "",
                                FileMappings: [],
                                Questions: []
                            };

                            for (let i = random.integer(1, 5); i > 0; i--)
                            {
                                component.Questions.push(
                                    {
                                        name: randomString.next().value
                                    });
                            }

                            category.Components.push(component);
                        }

                        collectionOptions.Categories.push(category);
                    }
                });

            suite(
                nameof<ComponentCollection<any, any>>((collection) => collection.Categories),
                () =>
                {
                    test(
                        `Checking whether changes made to the \`${nameof<ComponentCollection<any, any>>((c) => c.Categories)}\` option immediately take effect…`,
                        () =>
                        {
                            let testName = "This is a test";
                            collectionOptions.Categories = [
                                {
                                    DisplayName: testName,
                                    Components: []
                                }
                            ];

                            strictEqual(collection.Categories[0].DisplayName, testName);
                        });
                });

            suite(
                nameof<MyComponentCollection>((collection) => collection.ComponentQuestions),
                () =>
                {
                    let component: Component<any, any>;
                    let question: Question<any>;
                    let componentQuestion: Question<any>;

                    setup(
                        () =>
                        {
                            component = random.pick(random.pick(collection.Categories).Components);
                            question = random.pick(component.Questions);
                            componentQuestion = collection.ComponentQuestions.find((item) => item.name === question.name);
                        });

                    test(
                        "Checking whether all questions are present…",
                        () =>
                        {
                            for (let category of collectionOptions.Categories)
                            {
                                for (let component of category.Components)
                                {
                                    for (let question of component.Questions)
                                    {
                                        ok(
                                            collection.ComponentQuestions.some(
                                                (componentQuestion) =>
                                                {
                                                    return componentQuestion.name === question.name;
                                                }));
                                    }
                                }
                            }
                        });

                    test(
                        "Checking whether questions are only asked if the corresponding component is selected…",
                        async () =>
                        {
                            let settings: IGeneratorSettings = {
                                ...generator.Settings,
                                [GeneratorSettingKey.Components]: []
                            };

                            ok(
                                typeof componentQuestion.when === "function" &&
                                !await componentQuestion.when(settings));

                            settings[GeneratorSettingKey.Components] = [
                                component.ID
                            ];

                            ok(
                                typeof componentQuestion.when === "function" &&
                                await componentQuestion.when(settings));
                        });

                    test(
                        "Checking whether custom predicates are taken care of…",
                        async () =>
                        {
                            question.when = false;

                            let settings: IGeneratorSettings = {
                                [GeneratorSettingKey.Components]: [
                                    component.ID
                                ]
                            };

                            ok(
                                typeof componentQuestion.when === "function" &&
                                !await componentQuestion.when({}));

                            ok(
                                typeof componentQuestion.when === "function" &&
                                !await componentQuestion.when(settings));

                            let value: boolean;
                            question.when = () => value;

                            for (let i = random.integer(1, 5); i > 0; i--)
                            {
                                value = random.bool();

                                ok(
                                    typeof componentQuestion.when === "function" &&
                                    !await componentQuestion.when({}));

                                strictEqual(
                                    typeof componentQuestion.when === "function" ?
                                        await componentQuestion.when(settings) :
                                        false,
                                    value);
                            }
                        });
                });
        });
}
