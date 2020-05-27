import chalk = require("chalk");
import { ChoiceCollection, Separator } from "inquirer";
import Path = require("path");
import PkgUp = require("pkg-up");
import { isNullOrUndefined } from "util";
import YeomanGenerator = require("yeoman-generator");
import { Question } from "yeoman-generator";
import { GeneratorSettingKey } from "./GeneratorSettingKey";
import { IGeneratorSettings } from "./IGeneratorSettings";
import { IGenerator } from "./IGenerator";
import { ComponentCollection } from "./Components/ComponentCollection";
import { FileMapping } from "./Components/FileMapping";
import { IComponentCollection } from "./Components/IComponentCollection";

/**
 * Represents a yeoman-generator.
 */
export abstract class Generator<T extends IGeneratorSettings = IGeneratorSettings> extends YeomanGenerator implements IGenerator<T>
{
    /**
     * The root of the module of the generator.
     */
    private moduleRoot: string;

    /**
     * The settings of the generator.
     */
    private settings: T = {} as T;

    /**
     * Initializes a new instance of the `Generator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: {})
    {
        super(args, options);
        this.moduleRoot = Path.dirname(PkgUp.sync({ cwd: this.resolved }));
    }

    /**
     * Gets the name of the root of the template-folder.
     */
    protected get TemplateRoot(): string
    {
        return "";
    }

    /**
     * Gets the options for the components the user can select.
     */
    protected get Components(): IComponentCollection<T>
    {
        return null;
    }

    /**
     * Gets the components the user can select.
     */
    protected get ComponentCollection(): ComponentCollection<T>
    {
        if (this.Components)
        {
            return new ComponentCollection(this, this.Components);
        }
        else
        {
            return null;
        }
    }

    /**
     * Gets the questions to ask before executing the generator.
     */
    protected get Questions(): Array<Question<T>>
    {
        return [];
    }

    /**
     * Gets all questions including questions for the components.
     */
    protected get QuestionCollection(): Array<Question<T>>
    {
        let result: Array<Question<T>> = [];
        let components: ChoiceCollection<T> = [];
        let defaults: string[] = [];

        if (this.ComponentCollection)
        {
            for (let category of this.ComponentCollection.Categories ?? [])
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
    
                    for (let i = 0; i < component.Questions?.length ?? 0; i++)
                    {
                        let question = component.Questions[i];
                        let when = question.when;
    
                        question.when = async (settings: T) =>
                        {
                            if (settings[GeneratorSettingKey.Components].includes(component.ID))
                            {
                                if (i === 0)
                                {
                                    this.log();
                                    this.log(`${chalk.red(">>")} ${chalk.bold(component.DisplayName)} ${chalk.red("<<")}`);
                                }
    
                                if (!isNullOrUndefined(when))
                                {
                                    if (typeof when === "function")
                                    {
                                        return when(settings);
                                    }
                                    else
                                    {
                                        return when;
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
                        
                        result.push(question);
                    }
                }
            }
    
            result.unshift(
                {
                    type: "checkbox",
                    name: GeneratorSettingKey.Components,
                    message: this.Components.Question,
                    choices: components,
                    default: defaults
                });
    
            result.unshift(...(this.Questions ?? []));
        }

        return result;
    }

    /**
     * @inheritdoc
     */
    public get Settings()
    {
        return this.settings;
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path that is to be joined.
     */
    public modulePath(...path: string[])
    {
        return Path.join(this.moduleRoot, ...path);
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path that is to be joined.
     */
    public templatePath(...path: string[])
    {
        return this.modulePath("templates", this.TemplateRoot, ...path);
    }

    /**
     * Gathers all information for executing the generator and saves them to the `Settings`.
     */
    public async prompting()
    {
        Object.assign(this.Settings, await this.prompt(this.QuestionCollection));
        this.log();
    }

    /**
     * Writes all files for the components.
     */
    public async writing()
    {
        for (let category of this.ComponentCollection?.Categories ?? [])
        {
            for (let component of category.Components)
            {
                if (this.Settings[GeneratorSettingKey.Components].includes(component.ID))
                {
                    for (let fileMapping of await component.FileMappings)
                    {
                        await this.ProcessFile(fileMapping);
                    }
                }
            }
        }
    }

    /**
     * Installs all required dependencies.
     */
    public async install()
    {
    }

    /**
     * Finalizes the generation-process.
     */
    public async end()
    {
    }

    /**
     * Processes a file-mapping.
     *
     * @param fileMapping
     * The file-mapping to process.
     */
    protected async ProcessFile(fileMapping: FileMapping<T>)
    {
        let result = fileMapping.Processor(fileMapping, this);

        if (result instanceof Promise)
        {
            return result;
        }
    }
}