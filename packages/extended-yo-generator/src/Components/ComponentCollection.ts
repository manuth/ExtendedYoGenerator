import chalk = require("chalk");
import { CheckboxQuestion, ChoiceCollection, Separator } from "inquirer";
import { Question } from "yeoman-generator";
import { GeneratorSettingKey } from "../GeneratorSettingKey";
import { IGenerator } from "../IGenerator";
import { IGeneratorSettings } from "../IGeneratorSettings";
import { CategoryOptionCollection } from "./CategoryOptionCollection";
import { ComponentCategory } from "./ComponentCategory";
import { IComponentCollection } from "./IComponentCollection";
import { PropertyResolver } from "./Resolving/PropertyResolver";

/**
 * Represents a set of components.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class ComponentCollection<TSettings extends IGeneratorSettings, TOptions> extends PropertyResolver<IComponentCollection<TSettings, TOptions>, ComponentCollection<TSettings, TOptions>, TSettings, TOptions> implements IComponentCollection<TSettings, TOptions>
{
    /**
     * The categories of the collection.
     */
    private categoryCollection: CategoryOptionCollection = null;

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
    public get Categories(): CategoryOptionCollection
    {
        if (this.categoryCollection === null)
        {
            this.categoryCollection = new CategoryOptionCollection(
                this.Generator,
                this.Object.Categories.map(
                    (category) =>
                    {
                        return new ComponentCategory(this.Generator, category);
                    }));
        }

        return this.categoryCollection;
    }

    /**
     * Gets the question to ask for the components.
     */
    protected get ComponentChoiceQuestion(): CheckboxQuestion<TSettings>
    {
        let components: ChoiceCollection<TSettings> = [];
        let defaults: string[] = [];

        for (let category of this.Categories ?? [])
        {
            components.push(new Separator(category.DisplayName));

            for (let component of category.Components)
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

        for (let category of this.Categories ?? [])
        {
            for (let component of category.Components)
            {
                for (let i = 0; i < component.Questions?.length ?? 0; i++)
                {
                    let question = component.Questions[i];
                    let predicate = question.when;

                    question.when = async (settings: TSettings) =>
                    {
                        if ((settings[GeneratorSettingKey.Components] ?? []).includes(component.ID))
                        {
                            if (i === 0)
                            {
                                this.Generator.log();
                                this.Generator.log(`${chalk.red(">>")} ${chalk.bold(component.DisplayName)} ${chalk.red("<<")}`);
                            }

                            if (predicate)
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
                    };

                    result.push(question);
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
}
