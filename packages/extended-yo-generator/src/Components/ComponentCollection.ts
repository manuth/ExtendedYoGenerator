import chalk from "chalk";
import inquirer, { CheckboxQuestion, ChoiceCollection } from "inquirer";
import { Question } from "yeoman-generator";
import { CategoryCollectionEditor } from "../Collections/CategoryCollectionEditor.js";
import { GeneratorSettingKey } from "../GeneratorSettingKey.js";
import { IGenerator } from "../IGenerator.js";
import { IGeneratorSettings } from "../IGeneratorSettings.js";
import { ComponentCategory } from "./ComponentCategory.js";
import { IComponentCollection } from "./IComponentCollection.js";
import { PropertyResolver } from "./Resolving/PropertyResolver.js";

/**
 * Represents a set of components.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class ComponentCollection<TSettings extends IGeneratorSettings, TOptions> extends PropertyResolver<IComponentCollection<TSettings, TOptions>, ComponentCollection<TSettings, TOptions>, TSettings, TOptions>
{
    /**
     * A component for editing the categories of this collection.
     */
    private categories: CategoryCollectionEditor = null;

    /**
     * Initializes a new instance of the {@link ComponentCollection `ComponentCollection<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param componentCollection
     * The options of the collection.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, componentCollection: IComponentCollection<TSettings, TOptions>)
    {
        super(generator, componentCollection);
    }

    /**
     * Gets or sets the question to show when asking to choose components.
     */
    public get Question(): string
    {
        return this.Object.Question;
    }

    /**
     * @inheritdoc
     */
    public set Question(value: string)
    {
        this.Object.Question = value;
    }

    /**
     * Gets or sets the component-categories.
     */
    public get Categories(): CategoryCollectionEditor
    {
        if (this.categories === null)
        {
            this.categories = new CategoryCollectionEditor(
                this.Generator,
                () =>
                {
                    return this.Object.Categories.map(
                        (category) =>
                        {
                            return new ComponentCategory(this.Generator, category);
                        });
                });
        }

        return this.categories;
    }

    /**
     * Gets the question to ask for the components.
     */
    protected get ComponentChoiceQuestion(): CheckboxQuestion<TSettings>
    {
        let components: ChoiceCollection<TSettings> = [];
        let defaults: string[] = [];

        for (let category of this.Categories.Items ?? [])
        {
            components.push(new inquirer.Separator(category.DisplayName));

            for (let component of category.Components.Items)
            {
                let isDefault = component.DefaultEnabled ?? false;

                components.push(
                    {
                        value: component.ID,
                        name: component.DisplayName,
                        checked: isDefault
                    });

                if (isDefault)
                {
                    defaults.push(component.ID);
                }
            }
        }

        return {
            type: "checkbox",
            name: GeneratorSettingKey.Components,
            message: this.Question,
            choices: components,
            default: defaults
        };
    }

    /**
     * Gets the questions for asking for component details.
     */
    protected get ComponentQuestions(): Array<Question<TSettings>>
    {
        let result: Array<Question<TSettings>> = [];

        for (let category of this.Categories.Items ?? [])
        {
            for (let component of category.Components.Items)
            {
                for (let i = 0; i < component.Questions.Items.length ?? 0; i++)
                {
                    let question = component.Questions.Items[i];

                    result.push(
                        {
                            ...question,
                            when: async (settings: TSettings) =>
                            {
                                let predicate = question.when;

                                if ((settings[GeneratorSettingKey.Components] ?? []).includes(component.ID))
                                {
                                    if (i === 0)
                                    {
                                        this.Generator.log();
                                        this.Generator.log(`${chalk.red(">>")} ${chalk.bold(component.DisplayName)} ${chalk.red("<<")}`);
                                    }

                                    if (predicate !== null && predicate !== undefined)
                                    {
                                        if (typeof predicate === "function")
                                        {
                                            return predicate(settings);
                                        }
                                        else
                                        {
                                            return predicate;
                                        }
                                    }
                                    else
                                    {
                                        return true;
                                    }
                                }
                                else
                                {
                                    return false;
                                }
                            }
                        });
                }
            }
        }

        return result;
    }

    /**
     * Gets the questions for asking for components and details.
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return [
            this.ComponentChoiceQuestion,
            ...this.ComponentQuestions
        ];
    }

    /**
     * @inheritdoc
     */
    public get Result(): IComponentCollection<TSettings, TOptions>
    {
        return {
            Question: this.Question,
            Categories: this.Categories.Items.map((item) => item.Result)
        };
    }
}
