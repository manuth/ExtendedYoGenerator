import Path = require("path");
import { isNullOrUndefined } from "util";
import chalk = require("chalk");
import { ChoiceCollection, Separator } from "inquirer";
import PkgUp = require("pkg-up");
import YeomanGenerator = require("yeoman-generator");
import { Question } from "yeoman-generator";
import { ComponentCollection } from "./Components/ComponentCollection";
import { FileMapping } from "./Components/FileMapping";
import { IComponentCollection } from "./Components/IComponentCollection";
import { IFileMapping } from "./Components/IFileMapping";
import { GeneratorSettingKey } from "./GeneratorSettingKey";
import { IGenerator } from "./IGenerator";
import { IGeneratorSettings } from "./IGeneratorSettings";

/**
 * Represents a yeoman-generator.
 *
 * @template T
 * The type of the settings of the generator.
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
    public constructor(args: string | string[], options: Record<string, unknown>)
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
                                    this.log("");
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
                        };

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
        }

        result.unshift(...(this.Questions ?? []));
        return result;
    }

    /**
     * Gets the options for the file-mappings of the generator.
     */
    protected get FileMappings(): Array<IFileMapping<T>>
    {
        return [];
    }

    /**
     * Gets the file-mappings of the generator.
     */
    protected get FileMappingCollection(): Array<FileMapping<T>>
    {
        return (this.FileMappings ?? []).map((fileMapping) => new FileMapping(this, fileMapping));
    }

    /**
     * @inheritdoc
     */
    public get Settings(): T
    {
        return this.settings;
    }

    /**
     * @inheritdoc
     *
     * @param rootPath
     * The new destination root path.
     *
     * @param skipEnvironment
     * A value indicating whether `this.env.cwd` and the current working directory shouldn't be changed.
     *
     * @returns
     * The `destinationRoot` of the generator.
     */
    public destinationRoot(rootPath?: string, skipEnvironment?: boolean): string
    {
        if (isNullOrUndefined(skipEnvironment))
        {
            skipEnvironment = true;
        }

        return super.destinationRoot(rootPath, skipEnvironment);
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path that is to be joined.
     *
     * @returns
     * The joined path.
     */
    public modulePath(...path: string[]): string
    {
        return Path.join(this.moduleRoot, ...path);
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path that is to be joined.
     *
     * @returns
     * The joined path.
     */
    public commonTemplatePath(...path: string[]): string
    {
        return this.modulePath("templates", ...path);
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path that is to be joined.
     *
     * @returns
     * The joined path.
     */
    public templatePath(...path: string[]): string
    {
        return this.commonTemplatePath(...(this.TemplateRoot ? [this.TemplateRoot] : []), ...path);
    }

    /**
     * Initializes the generator.
     */
    public async initializing(): Promise<void>
    { }

    /**
     * Gathers all information for executing the generator and saves them to the `Settings`.
     */
    public async prompting(): Promise<void>
    {
        Object.assign(this.Settings, await this.prompt(this.QuestionCollection));
        this.log("");
    }

    /**
     * Writes all files for the components.
     */
    public async writing(): Promise<void>
    {
        for (let fileMapping of this.FileMappingCollection)
        {
            await this.ProcessFile(fileMapping);
        }

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
    public async install(): Promise<void>
    { }

    /**
     * Finalizes the generation-process.
     */
    public async end(): Promise<void>
    { }

    /**
     * Processes a file-mapping.
     *
     * @param fileMapping
     * The file-mapping to process.
     */
    protected async ProcessFile(fileMapping: FileMapping<T>): Promise<void>
    {
        let result = fileMapping.Processor(fileMapping, this);

        if (result instanceof Promise)
        {
            return result;
        }
    }
}
