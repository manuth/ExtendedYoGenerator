import { ok, strictEqual } from "assert";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import rescape = require("@stdlib/utils-escape-regexp-string");
import { CheckboxChoiceOptions, CheckboxQuestion, Separator } from "inquirer";
import { replace, replaceGetter, restore } from "sinon";
import { Logger, Question } from "yeoman-environment";
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
                    generator = await context.Generator;
                    collection = new MyComponentCollection(generator, collectionOptions);
                });

            setup(
                () =>
                {
                    randomString = function*()
                    {
                        let i = 1;

                        while (true)
                        {
                            yield context.Random.string(i++);
                        }
                    }();

                    collectionOptions.Question = randomString.next().value;
                    collectionOptions.Categories = [];

                    for (let i = context.Random.integer(2, 5); i > 0; i--)
                    {
                        let category: IComponentCategory<any, any> = {
                            ID: randomString.next().value,
                            DisplayName: "",
                            Components: []
                        };

                        for (let i = context.Random.integer(2, 5); i > 0; i--)
                        {
                            let component: IComponent<any, any> = {
                                ID: randomString.next().value,
                                DisplayName: "",
                                FileMappings: [],
                                Questions: []
                            };

                            for (let i = context.Random.integer(2, 5); i > 0; i--)
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
                nameof<ComponentCollection<any, any>>((collection) => collection.Question),
                () =>
                {
                    test(
                        "Checking whether the value can be set…",
                        () =>
                        {
                            let value = context.RandomString;
                            collection.Question = value;
                            strictEqual(collection.Question, value);
                        });
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

                            strictEqual(collection.Categories.Items[0].DisplayName, testName);
                        });
                });

            suite(
                nameof<MyComponentCollection>((collection) => collection.ComponentChoiceQuestion),
                () =>
                {
                    setup(
                        () =>
                        {
                            for (let category of collectionOptions.Categories)
                            {
                                category.DisplayName = randomString.next().value;

                                for (let component of category.Components)
                                {
                                    component.DisplayName = randomString.next().value;
                                    component.DefaultEnabled = context.Random.bool();
                                }
                            }
                        });

                    test(
                        `Checking whether the message of the question is applied according to the ${nameof<MyComponentCollection>((c) => c.Question)}\`-property…`,
                        () =>
                        {
                            strictEqual(collection.ComponentChoiceQuestion.message, collectionOptions.Question);
                        });

                    test(
                        `Checking whether separators for all \`${nameof<MyComponentCollection>((c) => c.Categories)}\` are present…`,
                        () =>
                        {
                            for (let category of collection.Categories.Items)
                            {
                                ok(
                                    Array.isArray(collection.ComponentChoiceQuestion.choices) &&
                                    collection.ComponentChoiceQuestion.choices.some(
                                        (choice) =>
                                        {
                                            return choice instanceof Separator &&
                                                choice.line === category.DisplayName;
                                        }));
                            }
                        });

                    test(
                        `Checking whether choices for all \`${nameof<MyComponentCollection>((c) => c.Categories.Items[0].Components)}\` are present…`,
                        () =>
                        {
                            for (let component of collection.Categories.Items.flatMap((category) => category.Components.Items))
                            {
                                ok(
                                    Array.isArray(collection.ComponentChoiceQuestion.choices) &&
                                    collection.ComponentChoiceQuestion.choices.some(
                                        (choice: CheckboxChoiceOptions<any>) =>
                                        {
                                            return choice.name === component.DisplayName &&
                                                choice.value === component.ID;
                                        }));
                            }
                        });

                    test(
                        `Checking whether components with \`${nameof<Component<any, any>>((c) => c.DefaultEnabled)}\` set to \`${true}\` are enabled by default…`,
                        () =>
                        {
                            for (let component of collection.Categories.Items.flatMap((category) => category.Components.Items))
                            {
                                strictEqual(
                                    Array.isArray(collection.ComponentChoiceQuestion.default) &&
                                    collection.ComponentChoiceQuestion.default.includes(component.ID),
                                    component.DefaultEnabled);

                                ok(
                                    Array.isArray(collection.ComponentChoiceQuestion.choices) &&
                                    collection.ComponentChoiceQuestion.choices.some(
                                        (choice: CheckboxChoiceOptions<any>) =>
                                        {
                                            return choice.name === component.DisplayName &&
                                                choice.value === component.ID &&
                                                choice.checked === component.DefaultEnabled;
                                        }));
                            }
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
                            component = context.Random.pick(context.Random.pick(collection.Categories.Items).Components.Items);
                            question = context.Random.pick(component.Questions.Items);
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
                        "Checking whether headings for the selected components are displayed to the user…",
                        async () =>
                        {
                            let componentSample = context.Random.sample(collection.Categories.Items.flatMap((category) => category.Components.Items), 2);
                            let enabledComponent = componentSample[0];
                            let disabledComponent = componentSample[1];
                            let logMessages: string[] = [];
                            enabledComponent.DisplayName = randomString.next().value;
                            disabledComponent.DisplayName = randomString.next().value;

                            /**
                             * Asserts the presence of the heading of the specified {@link component `component`} is present in the log-messages.
                             *
                             * @param component
                             * The component to check.
                             *
                             * @param present
                             * A value indicating whether the heading is expected to be present.
                             *
                             * @returns
                             * A value indicating whether the heading of the specified {@link component `component`} is present.
                             */
                            function AssertHeadingPresence(component: Component<any, any>, present: boolean): void
                            {
                                strictEqual(
                                    logMessages.some(
                                        (logMessage) => new RegExp(`\\b${rescape(component.DisplayName)}\\b`).test(logMessage)),
                                    present);
                            }

                            replaceGetter(
                                generator,
                                "Settings",
                                () =>
                                {
                                    return {
                                        [GeneratorSettingKey.Components]: [
                                            enabledComponent.ID
                                        ]
                                    } as ITestGeneratorSettings;
                                });

                            replace(
                                generator,
                                "log",
                                (
                                    (message) =>
                                    {
                                        logMessages.push(message);
                                    }) as Logger);

                            for (let question of collection.ComponentQuestions)
                            {
                                if (typeof question.when === "function")
                                {
                                    await question.when(generator.Settings);
                                }
                            }

                            restore();
                            AssertHeadingPresence(enabledComponent, true);
                            AssertHeadingPresence(disabledComponent, false);
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

                            for (let i = context.Random.integer(1, 5); i > 0; i--)
                            {
                                value = context.Random.bool();

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
